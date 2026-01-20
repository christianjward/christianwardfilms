const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, getDocs } = require("firebase/firestore");

// Hardcoded config from lib/firebase.js to avoid module import issues in simple script
// Hardcoded config removed for security.
// Use lib/firebase.js instead if running within Next.js context.
const firebaseConfig = {
    apiKey: "REMOVED",
    authDomain: "REMOVED",
    projectId: "REMOVED",
    storageBucket: "REMOVED",
    messagingSenderId: "REMOVED",
    appId: "REMOVED",
    measurementId: "REMOVED"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getShowreelUrl() {
    console.log("Searching for 'Showreel 2026'...");
    try {
        const q = query(collection(db, "videos"), where("title", "==", "Showreel 2026"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No document found with title 'Showreel 2026'");
            return;
        }

        querySnapshot.forEach((doc) => {
            console.log("FOUND_URL:", doc.data().url);
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

getShowreelUrl();
