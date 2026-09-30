(function () {
    const config = window.__FIREBASE_CONFIG__ || null;

    const state = {
        configured: Boolean(config),
        authReady: false,
        firestoreReady: false,
        storageReady: false,
        mode: 'static-demo'
    };

    if (config) {
        state.mode = 'firebase-config-present';
        state.authReady = true;
        state.firestoreReady = true;
        state.storageReady = true;
    }

    async function listCollection(name) {
        if (!state.configured) {
            return { ok: false, reason: 'Firebase is not configured in this static build.', data: [] };
        }
        return { ok: false, reason: `Collection "${name}" requires implementation with Firebase SDK wiring.`, data: [] };
    }

    async function saveDocument(collection, payload) {
        if (!state.configured) {
            return { ok: false, reason: 'Firebase is not configured in this static build.' };
        }
        return {
            ok: false,
            reason: `Write to "${collection}" is intentionally disabled until SDK + security rules are deployed.`,
            payload
        };
    }

    window.FirebaseAdapter = {
        getState() {
            return { ...state };
        },
        listCollection,
        saveDocument
    };
})();
