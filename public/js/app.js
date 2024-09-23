
// Push the initial state to the browser history so that the popstate event is triggered
console.log('Back Button Control Loaded');

window.history.pushState({}, '', window.location.pathname);
console.log('Initial State Pushed:', window.location.pathname);

window.addEventListener('popstate', function(event) {
    console.log('Popstate event triggered:', window.location.pathname);
    const currentPath = window.location.pathname;

    if (currentPath === '/customers') {
        window.location.href = "/profile";
    } else if (currentPath === '/editcustomer') {
        window.location.href = "/profile";
    } else {
        window.location.href = "/";
    }
});

// Optional: Prevent users from navigating back
window.history.pushState(null, null, window.location.href);

window.addEventListener('popstate', function(event) {
    window.history.pushState(null, null, window.location.href);
});
