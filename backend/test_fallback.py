#!/usr/bin/env python3
"""
Test script to demonstrate the fallback functionality in AiAgent.py
when AI services are unavailable.
"""

import os
import sys
import json
from pathlib import Path

# Add the current directory to the path so we can import AiAgent
sys.path.insert(0, os.path.dirname(__file__))

from AiAgent import run_pipeline

def test_fallback_functionality():
    """Test the AI pipeline with fallback mechanisms"""
    
    print("="*60)
    print("TESTING SPARK MIND AI PIPELINE WITH FALLBACK SUPPORT")
    print("="*60)
    
    # Create some dummy audio files for testing
    audio_dir = os.path.join(os.path.dirname(__file__), "audio")
    audio_files = []
    
    # Look for existing audio files
    if os.path.exists(audio_dir):
        for file in os.listdir(audio_dir):
            if file.endswith(('.mp3', '.wav', '.webm', '.m4a')):
                audio_files.append(os.path.join(audio_dir, file))
    
    if not audio_files:
        print("[WARN] No audio files found in audio/ directory")
        print("[INFO] Creating a dummy audio file path for testing...")
        # Create a dummy path - the fallback system should handle missing files gracefully
        audio_files = [os.path.join(audio_dir, "test_audio.mp3")]
    
    print(f"[INFO] Testing with audio files: {audio_files}")
    
    try:
        # Run the pipeline
        result = run_pipeline(
            audio_path=audio_files,
            offline_sentiment=True  # Use offline sentiment to avoid additional API calls
        )
        
        print("\n" + "="*60)
        print("PIPELINE EXECUTION RESULTS")
        print("="*60)
        
        print(f"✅ Pipeline Status: {'Fallback Mode' if result.get('fallback_mode') else 'Normal Mode'}")
        print(f"🔧 AI Service Status: {result.get('ai_service_status', 'unknown')}")
        print(f"📊 Scores Available: {'Yes' if result.get('scores') else 'No'}")
        print(f"📄 Doctor Report Length: {len(result.get('doctor_report', '')) if result.get('doctor_report') else 0} chars")
        print(f"📝 Summary Length: {len(result.get('summary', '')) if result.get('summary') else 0} chars")
        print(f"📧 Email Length: {len(result.get('email', '')) if result.get('email') else 0} chars")
        
        # Print file paths
        if result.get('pdf_path'):
            print(f"📋 PDF Report: {os.path.basename(result['pdf_path'])}")
        if result.get('summary_path'):
            print(f"📄 Summary File: {os.path.basename(result['summary_path'])}")
        if result.get('email_path'):
            print(f"📧 Email File: {os.path.basename(result['email_path'])}")
        
        # Show a preview of the generated content
        if result.get('doctor_report'):
            print(f"\n📋 Doctor Report Preview (first 200 chars):")
            print("-" * 50)
            print(result['doctor_report'][:200] + "..." if len(result['doctor_report']) > 200 else result['doctor_report'])
            
        if result.get('summary'):
            print(f"\n📝 Summary Preview (first 200 chars):")
            print("-" * 50)
            print(result['summary'][:200] + "..." if len(result['summary']) > 200 else result['summary'])
        
        print(f"\n✅ TEST COMPLETED SUCCESSFULLY!")
        print(f"Mode: {'FALLBACK' if result.get('fallback_mode') else 'NORMAL'}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Pipeline execution failed: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    success = test_fallback_functionality()
    sys.exit(0 if success else 1)