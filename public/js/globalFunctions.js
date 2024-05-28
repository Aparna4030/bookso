document.addEventListener('DOMContentLoaded',()=>{
 
    const notificationCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('notify='));
    if(notificationCookie){
        const cookieName = notificationCookie.split('=')[0];
        const notificationContent =decodeURIComponent(notificationCookie.split('=')[1]);
    
        window.showToast(notificationContent)
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
})