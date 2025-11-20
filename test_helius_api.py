#!/usr/bin/env python3
"""
Test Helius API - getAsset endpoint
API Key: 3951cd4d-4771-4ffa-ace4-b8ee5b2ad50b
"""

import requests
import json
from typing import Any, Dict

# API Configuration
API_KEY = "3951cd4d-4771-4ffa-ace4-b8ee5b2ad50b"
RPC_URL = f"https://mainnet.helius-rpc.com/?api-key={API_KEY}"

def test_get_token_supply(token_mint: str = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") -> Dict[str, Any]:
    """Test getTokenSupply - Check the total supply of a token"""
    print("\n" + "="*60)
    print("TEST 1: Get Token Supply")
    print("="*60)
    
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getTokenSupply",
        "params": [token_mint]
    }
    
    print(f"\nToken Mint: {token_mint}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(RPC_URL, json=payload)
        result = response.json()
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        return result
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}


def test_get_token_account_balance(token_account: str = "3emsAVdmGKERbHjmGfQ6oZ1e35dkf5iYcS6U4CPKFVaa") -> Dict[str, Any]:
    """Test getTokenAccountBalance - Get balance for a specific token account"""
    print("\n" + "="*60)
    print("TEST 2: Get Token Account Balance")
    print("="*60)
    
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getTokenAccountBalance",
        "params": [token_account]
    }
    
    print(f"\nToken Account: {token_account}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(RPC_URL, json=payload)
        result = response.json()
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        return result
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}


def test_get_asset(asset_id: str = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") -> Dict[str, Any]:
    """Test getAsset - Advanced Token Data with DAS API"""
    print("\n" + "="*60)
    print("TEST 3: Get Asset (DAS API)")
    print("="*60)
    
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getAsset",
        "params": {
            "id": asset_id,
            "options": {
                "showFungible": True
            }
        }
    }
    
    print(f"\nAsset ID: {asset_id}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(RPC_URL, json=payload)
        result = response.json()
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        return result
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}


def test_get_token_accounts_by_owner(owner: str = "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY") -> Dict[str, Any]:
    """Test getTokenAccountsByOwner - List all token accounts owned by a wallet"""
    print("\n" + "="*60)
    print("TEST 4: Get Token Accounts by Owner")
    print("="*60)
    
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getTokenAccountsByOwner",
        "params": [
            owner,
            {
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
                "encoding": "jsonParsed"
            }
        ]
    }
    
    print(f"\nOwner: {owner}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(RPC_URL, json=payload)
        result = response.json()
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        return result
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}


def test_api_connectivity() -> bool:
    """Test basic API connectivity"""
    print("\n" + "="*60)
    print("TEST 0: API Connectivity Test")
    print("="*60)
    print(f"\nTesting connection to: {RPC_URL}")
    
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getHealth"
    }
    
    try:
        response = requests.post(RPC_URL, json=payload, timeout=10)
        result = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200:
            print("\n✓ API is accessible!")
            return True
        else:
            print("\n✗ API returned non-200 status")
            return False
    except Exception as e:
        print(f"✗ Connection error: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("HELIUS API TEST SUITE")
    print("="*60)
    print(f"\nAPI Key (truncated): {API_KEY[:8]}...{API_KEY[-4:]}")
    print(f"RPC URL: {RPC_URL}")
    
    results = {}
    
    # Test connectivity first
    if not test_api_connectivity():
        print("\n✗ Cannot connect to API. Please check your API key and internet connection.")
        return
    
    # Run all tests
    results['token_supply'] = test_get_token_supply()
    results['token_account_balance'] = test_get_token_account_balance()
    results['asset'] = test_get_asset()
    results['token_accounts_by_owner'] = test_get_token_accounts_by_owner()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    success_count = 0
    for test_name, result in results.items():
        has_error = "error" in result
        status = "✗ FAILED" if has_error else "✓ PASSED"
        print(f"{status}: {test_name}")
        if has_error:
            print(f"  Error: {result['error']}")
        success_count += 0 if has_error else 1
    
    print(f"\nTotal: {success_count}/{len(results)} tests passed")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
