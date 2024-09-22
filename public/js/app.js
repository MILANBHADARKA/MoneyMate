window.addEventListener('beforeunload', function(event) {
    const currentPath = window.location.pathname; // Get current path of the page

    // Check the current page and redirect accordingly
    if (currentPath === '/customers') {
        window.location.href = "/profile"; // Redirect after back on form page
    } else if (currentPath === '/editcustomer') {
        window.location.href = "/profile"; // Redirect after back on thank-you page
    } else {
        window.location.href = "/"; // Default redirect
    }
});