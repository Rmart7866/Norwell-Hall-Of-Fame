// src/components/admin/FirebaseTest.jsx
import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AlertCircle, CheckCircle } from 'lucide-react';

const FirebaseTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);

    const results = {
      configCheck: null,
      readTest: null,
      writeTest: null,
      error: null
    };

    try {
      // Check if db is properly initialized
      if (!db) {
        results.configCheck = '❌ Firestore not initialized';
        setTestResult(results);
        setLoading(false);
        return;
      }
      results.configCheck = '✅ Firestore initialized';

      // Test READ from pages/about
      try {
        const docRef = doc(db, 'pages', 'about');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          results.readTest = '✅ Successfully read existing document';
        } else {
          results.readTest = '⚠️ Document does not exist yet (this is OK)';
        }
      } catch (readError) {
        results.readTest = `❌ Read failed: ${readError.message}`;
        results.error = readError;
      }

      // Test WRITE to pages/test
      try {
        const testDocRef = doc(db, 'pages', 'test');
        await setDoc(testDocRef, {
          timestamp: new Date(),
          test: true
        });
        results.writeTest = '✅ Successfully wrote test document';
      } catch (writeError) {
        results.writeTest = `❌ Write failed: ${writeError.message}`;
        if (!results.error) results.error = writeError;
      }

    } catch (error) {
      results.error = error;
    }

    setTestResult(results);
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🔍 Firebase Diagnostics</h3>
      
      <button
        onClick={runTest}
        disabled={loading}
        className="bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400 mb-4"
      >
        {loading ? 'Testing...' : 'Run Diagnostics'}
      </button>

      {testResult && (
        <div className="space-y-3">
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <h4 className="font-bold mb-2">Test Results:</h4>
            <div className="space-y-2 text-sm">
              <p>{testResult.configCheck}</p>
              {testResult.readTest && <p>{testResult.readTest}</p>}
              {testResult.writeTest && <p>{testResult.writeTest}</p>}
            </div>
          </div>

          {testResult.error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 mb-2">Error Details:</h4>
                  <pre className="text-xs bg-red-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(testResult.error, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {!testResult.error && testResult.writeTest?.includes('✅') && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-green-800">All Tests Passed!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Firebase is working correctly. The About Page editor should work now.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mt-4">
            <h4 className="font-bold text-blue-800 mb-2">Common Issues & Fixes:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li><strong>Missing or insufficient permissions:</strong> Check Firebase Console → Firestore Database → Rules</li>
              <li><strong>Config not found:</strong> Verify .env file has all VITE_FIREBASE_* variables</li>
              <li><strong>Wrong project:</strong> Make sure projectId in config matches your Firebase project</li>
              <li><strong>Firestore not enabled:</strong> Enable Firestore in Firebase Console</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">Your Current Rules Should Be:</h4>
            <pre className="text-xs bg-yellow-100 p-3 rounded overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;
