// auth-config.js
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    const token = localStorage.getItem('admin_token');
    if (token) {
        jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
    }
});

// Also a good place to handle global 401 (Unauthorized) errors
$(document).ajaxError(function(event, jqXHR) {
    if (jqXHR.status === 401) {
        // Token is likely expired or invalid
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login?error=session_expired';
    }
});