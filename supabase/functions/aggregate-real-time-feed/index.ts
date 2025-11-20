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

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Fetch recent data dari semua tabel untuk membuat feed
        const fetchWhales = fetch(
            `${supabaseUrl}/rest/v1/whale_events?order=timestamp.desc&limit=5`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        const fetchMarket = fetch(
            `${supabaseUrl}/rest/v1/market_flow?order=timestamp.desc&limit=5`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        const fetchStaking = fetch(
            `${supabaseUrl}/rest/v1/staking_data?order=timestamp.desc&limit=5`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        const [whalesRes, marketRes, stakingRes] = await Promise.all([fetchWhales, fetchMarket, fetchStaking]);

        if (!whalesRes.ok || !marketRes.ok || !stakingRes.ok) {
            throw new Error('Failed to fetch data from database');
        }

        const whales = await whalesRes.json();
        const market = await marketRes.json();
        const staking = await stakingRes.json();

        // Aggregate menjadi feed events
        const feedEvents = [];

        // Whale events
        whales.forEach(whale => {
            feedEvents.push({
                event_type: 'whale_alert',
                title: `Whale ${whale.transaction_type}: ${whale.amount} ${whale.token_symbol}`,
                description: `Wallet ${whale.wallet_address.substring(0, 8)}... ${whale.transaction_type} ${whale.amount} ${whale.token_symbol} (≈$${whale.usd_value.toLocaleString()})`,
                data: JSON.stringify(whale),
                priority: whale.is_suspicious ? 'high' : 'normal',
                timestamp: whale.timestamp
            });
        });

        // Market flow events
        market.forEach(flow => {
            feedEvents.push({
                event_type: 'market_swap',
                title: `Swap: ${flow.token_in} → ${flow.token_out}`,
                description: `${flow.amount_in} ${flow.token_in} swapped to ${flow.amount_out} ${flow.token_out} on ${flow.dex_name}`,
                data: JSON.stringify(flow),
                priority: 'normal',
                timestamp: flow.timestamp
            });
        });

        // Staking events
        staking.slice(0, 2).forEach(stake => {
            feedEvents.push({
                event_type: 'staking_update',
                title: `Validator Update: ${stake.validator_address.substring(0, 8)}...`,
                description: `Total stake: ${stake.total_stake.toLocaleString()} SOL with ${stake.delegators_count} delegators (APY: ${stake.apy}%)`,
                data: JSON.stringify(stake),
                priority: 'low',
                timestamp: stake.timestamp
            });
        });

        // Sort by timestamp descending
        feedEvents.sort((a, b) => b.timestamp - a.timestamp);

        // Insert feed events ke database
        const insertPromises = feedEvents.map(async (event) => {
            const insertResponse = await fetch(`${supabaseUrl}/rest/v1/real_time_feed`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(event)
            });

            if (!insertResponse.ok) {
                const errorText = await insertResponse.text();
                console.error('Failed to insert feed event:', errorText);
            }

            return insertResponse.ok;
        });

        await Promise.all(insertPromises);

        // Fetch feed terbaru dari database
        const feedResponse = await fetch(
            `${supabaseUrl}/rest/v1/real_time_feed?order=timestamp.desc&limit=30`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!feedResponse.ok) {
            throw new Error('Failed to fetch feed from database');
        }

        const feed = await feedResponse.json();

        return new Response(JSON.stringify({
            data: {
                feed_events: feed,
                count: feed.length,
                sources: {
                    whale_events: whales.length,
                    market_flows: market.length,
                    staking_updates: staking.length
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Feed aggregation error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'FEED_AGGREGATION_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
