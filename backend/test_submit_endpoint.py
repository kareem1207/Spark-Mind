#!/usr/bin/env python3
"""
Test script for the /submit-tests endpoint
"""

import requests
import json
import os
from pathlib import Path

# Configuration
BASE_URL = "http://127.0.0.1:8000"
ENDPOINT = "/api/submit-tests"

def test_submit_tests():
    """Test the submit-tests endpoint with various scenarios"""
    
    print("Testing /api/submit-tests endpoint...")
    
    # Test 1: Basic submission with only numeric scores (no audio)
    print("\n1. Testing basic submission (no audio files)...")
    
    data = {
        "memory_score": 85,
        "stroop_score": 92,
        "image_recall_score": 78
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/submit-tests", data=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Response:")
            print(f"  Memory Score: {result['memory_score']}")
            print(f"  Stroop Score: {result['stroop_score']}")
            print(f"  Image Recall Score: {result['image_recall_score']}")
            print(f"  Audio Files: {result['audio_files']}")
            print(f"  Status: {result['status']}")
            print(f"  Summary Report Length: {len(result['summary_report'])} characters")
        else:
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the FastAPI server is running.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Test 2: Test with missing required field
    print("\n2. Testing missing required field...")
    
    data_missing = {
        "memory_score": 85,
        "stroop_score": 92
        # Missing image_recall_score
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/submit-tests", data=data_missing)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 422:  # Validation error
            print("✅ Correctly rejected missing required field")
        else:
            print(f"❌ Unexpected response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    return True

def create_dummy_audio_test():
    """Test with dummy audio files"""
    print("\n3. Testing with dummy audio files...")
    
    # Create a small dummy audio file for testing
    dummy_content = b"dummy audio content for testing"
    
    data = {
        "memory_score": 88,
        "stroop_score": 95,
        "image_recall_score": 82
    }
    
    files = {
        "audio_q1": ("test_audio_1.mp3", dummy_content, "audio/mpeg"),
        "audio_q2": ("test_audio_2.mp3", dummy_content, "audio/mpeg")
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/submit-tests", data=data, files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Successfully submitted with audio files")
            print(f"  Audio Files Received: {result['audio_files']}")
            print(f"  Total Files: {len(result['audio_files'])}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("🧪 FastAPI Submit Tests Tester")
    print("=" * 40)
    
    if test_submit_tests():
        create_dummy_audio_test()
    
    print("\n✨ Testing completed!")
    print("\nTo start the server, run:")
    print("cd backend && python main.py")