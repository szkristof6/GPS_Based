export const redirect_time = 3 * 1000;


const notifications = document.querySelector(".notifications"),
buttons = document.querySelectorAll(".buttons .btn");

const toastDetails = {
    timer: 5000,
    success: {
        icon: './media/icons/success.webp',
        text: 'Success: This is a success toast.',
    },
    error: {
        icon: './media/icons/error.webp',
        text: 'Error: This is an error toast.',
    },
    warning: {
        icon: './media/icons/success.webp',
        text: 'Warning: This is a warning toast.',
    },
    info: {
        icon: './media/icons/success.webp',
        text: 'Info: This is an information toast.',
    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

export function openToast(text, title, type){
    // Getting the icon and text for the toast based on the id passed
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast`;
    // Setting the inner HTML for the toast
    const icon = type !== "success" ? "./media/icons/error.webp" : "/media/icons/success.webp";
    toast.innerHTML = `<div class="column">
                         <img src="${icon}" class="toast_img"></img>
                         <span>${text}</span>
                      </div>
                      <img class="toast_img_close toast_close" src="./media/icons/x.webp"></img>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    toast.querySelector(".toast_close").addEventListener("click", (e)=> removeToast(e.target.parentElement));
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}
