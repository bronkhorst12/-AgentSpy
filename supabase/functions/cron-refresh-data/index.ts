Deno.serve(async () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Starting data refresh cycle...');

        // Call all fetch functions to refresh data
        const refreshPromises = [
            fetch(`${supabaseUrl}/functions/v1/fetch-whale-transactions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch(`${supabaseUrl}/functions/v1/fetch-market-flow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch(`${supabaseUrl}/functions/v1/fetch-staking-data`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json'
                }
            })
        ];

        const results = await Promise.allSettled(refreshPromises);

        // Log results
        const summary = results.map((result, index) => {
            const names = ['whale-transactions', 'market-flow', 'staking-data'];
            if (result.status === 'fulfilled') {
                return { function: names[index], status: 'success', code: result.value.status };
            } else {
                return { function: names[index], status: 'failed', error: result.reason };
            }
        });

        console.log('Refresh summary:', JSON.stringify(summary));

        // Call aggregate feed after data is refreshed
        const feedResponse = await fetch(`${supabaseUrl}/functions/v1/aggregate-real-time-feed`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json'
            }
        });

        const feedStatus = feedResponse.ok ? 'success' : 'failed';
        console.log('Feed aggregation:', feedStatus);

        return new Response(JSON.stringify({
            success: true,
            timestamp: new Date().toISOString(),
            refreshed: summary,
            feed_status: feedStatus
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Cron refresh error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'CRON_REFRESH_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
