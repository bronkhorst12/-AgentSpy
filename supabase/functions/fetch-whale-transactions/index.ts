Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const solanaRpcUrl = Deno.env.get('SOLANA_RPC_URL') || 'https://api.mainnet-beta.solana.com';

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Threshold untuk whale (minimal 100 SOL)
        const WHALE_THRESHOLD_LAMPORTS = 100 * 1000000000;
        const LAMPORTS_PER_SOL = 1000000000;

        // Known whale wallets to monitor (top Solana holders)
        const WHALE_WALLETS = [
            '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
            '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
            'ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ',
            'GJa1VeEkLbsKFfTJQbSMSQbdvEjg6mLp4eSmjkereim'
        ];

        // Get current SOL price from Jupiter
        let solPrice = 50; // Default fallback
        try {
            const priceResponse = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
                { signal: AbortSignal.timeout(5000) }
            );
            if (priceResponse.ok) {
                const priceData = await priceResponse.json();
                solPrice = priceData.solana?.usd || 50;
            }
        } catch (e) {
            console.warn('Failed to fetch SOL price, using default:', e.message);
        }

        // Get current slot for reference
        const slotResponse = await fetch(solanaRpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getSlot',
                params: []
            })
        });

        if (!slotResponse.ok) {
            throw new Error('Failed to get current slot from Solana RPC');
        }

        const slotData = await slotResponse.json();
        const currentSlot = slotData.result || 0;

        // Fetch recent signatures for each whale wallet
        const whaleTransactions = [];

        for (const walletAddress of WHALE_WALLETS) {
            try {
                // Get recent signatures for this wallet
                const signaturesResponse = await fetch(solanaRpcUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getSignaturesForAddress',
                        params: [
                            walletAddress,
                            { limit: 5 }
                        ]
                    })
                });

                if (!signaturesResponse.ok) continue;

                const signaturesData = await signaturesResponse.json();
                const signatures = signaturesData.result || [];

                // Get transaction details for each signature
                for (const sigInfo of signatures.slice(0, 3)) {
                    try {
                        const txResponse = await fetch(solanaRpcUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                jsonrpc: '2.0',
                                id: 1,
                                method: 'getTransaction',
                                params: [
                                    sigInfo.signature,
                                    { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }
                                ]
                            })
                        });

                        if (!txResponse.ok) continue;

                        const txData = await txResponse.json();
                        const transaction = txData.result;

                        if (!transaction || transaction.meta?.err) continue;

                        // Parse transaction to find SOL transfers
                        const preBalances = transaction.meta?.preBalances || [];
                        const postBalances = transaction.meta?.postBalances || [];
                        const accountKeys = transaction.transaction?.message?.accountKeys || [];

                        // Find the largest balance change
                        let maxTransfer = 0;
                        let transferType = 'transfer';

                        for (let i = 0; i < preBalances.length; i++) {
                            const change = Math.abs(postBalances[i] - preBalances[i]);
                            if (change > maxTransfer) {
                                maxTransfer = change;
                            }
                        }

                        // Check if this is a whale transaction (>100 SOL)
                        if (maxTransfer >= WHALE_THRESHOLD_LAMPORTS) {
                            const amountSol = maxTransfer / LAMPORTS_PER_SOL;
                            const usdValue = amountSol * solPrice;

                            // Detect transaction type from instructions
                            const instructions = transaction.transaction?.message?.instructions || [];
                            for (const ix of instructions) {
                                if (ix.programId === 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' ||
                                    ix.programId === 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB') {
                                    transferType = 'swap';
                                    break;
                                }
                                if (ix.programId === 'Stake11111111111111111111111111111111111111') {
                                    transferType = 'stake';
                                    break;
                                }
                            }

                            // Check for suspicious activity (large transfers to new accounts)
                            const isSuspicious = amountSol > 1000 || 
                                (instructions.length > 5 && amountSol > 500);

                            whaleTransactions.push({
                                signature: sigInfo.signature,
                                wallet_address: walletAddress,
                                transaction_type: transferType,
                                amount: parseFloat(amountSol.toFixed(4)),
                                token_symbol: 'SOL',
                                token_mint: 'So11111111111111111111111111111111111111112',
                                usd_value: parseFloat(usdValue.toFixed(2)),
                                timestamp: sigInfo.blockTime || Math.floor(Date.now() / 1000),
                                block_number: sigInfo.slot || currentSlot,
                                is_suspicious: isSuspicious
                            });
                        }
                    } catch (txError) {
                        console.warn(`Failed to parse transaction ${sigInfo.signature}:`, txError.message);
                    }
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (walletError) {
                console.warn(`Failed to fetch transactions for ${walletAddress}:`, walletError.message);
            }
        }

        // Insert whale transactions to database
        if (whaleTransactions.length > 0) {
            const insertPromises = whaleTransactions.map(async (tx) => {
                const insertResponse = await fetch(`${supabaseUrl}/rest/v1/whale_events`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=ignore-duplicates'
                    },
                    body: JSON.stringify(tx)
                });

                if (!insertResponse.ok) {
                    const errorText = await insertResponse.text();
                    console.error(`Failed to insert transaction ${tx.signature}:`, errorText);
                }

                return insertResponse.ok;
            });

            await Promise.all(insertPromises);
        }

        // Fetch latest data from database
        const fetchResponse = await fetch(
            `${supabaseUrl}/rest/v1/whale_events?order=timestamp.desc&limit=20`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!fetchResponse.ok) {
            throw new Error('Failed to fetch whale events from database');
        }

        const whaleEvents = await fetchResponse.json();

        return new Response(JSON.stringify({
            data: {
                whale_events: whaleEvents,
                count: whaleEvents.length,
                threshold: WHALE_THRESHOLD_LAMPORTS / LAMPORTS_PER_SOL,
                current_slot: currentSlot,
                sol_price: solPrice,
                wallets_monitored: WHALE_WALLETS.length,
                new_transactions_found: whaleTransactions.length
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Whale tracker error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'WHALE_FETCH_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
