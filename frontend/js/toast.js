/*export function openToast(text, title, type) {
  const toast = document.querySelector(".toast");
  const progress = document.querySelector(".progress");

  const icon = toast.querySelector(".check");
  const text_1 = toast.querySelector(".text-1");
  const text_2 = toast.querySelector(".text-2");

  icon.src = type !== "success" ? "media/error.png" : "media/success.png";
  text_1.innerHTML = `${title}`;
  text_2.innerHTML = `${text}`;

  toast.classList.add("active");
  progress.classList.add("active");

  const timer1 = setTimeout(() => {
    toast.classList.remove("active");
  }, 5000);

  const timer2 = setTimeout(() => {
    progress.classList.remove("active");
  }, 5300);

  const closeIcon = toast.querySelector(".close");

  closeIcon.addEventListener("click", () => {
    toast.classList.remove("active");

    setTimeout(() => {
      progress.classList.remove("active");
    }, 300);

    clearTimeout(timer1);
    clearTimeout(timer2);
  });
}*/


export const redirect_time = 3 * 1000;


const notifications = document.querySelector(".notifications"),
buttons = document.querySelectorAll(".buttons .btn");

const toastDetails = {
    timer: 5000,
    success: {
        icon: 'media/success.png',
        text: 'Success: This is a success toast.',
    },
    error: {
        icon: 'media/error.png',
        text: 'Error: This is an error toast.',
    },
    warning: {
        icon: 'media/success.png',
        text: 'Warning: This is a warning toast.',
    },
    info: {
        icon: 'media/success.png',
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
    const icon = type !== "success" ? "media/error.png" : "media/success.png";
    toast.innerHTML = `<div class="column">
                         <img src="${icon}" class="toast_img"></img>
                         <span>${text}</span>
                      </div>
                      <img class="toast_img_close toast_close" src="media/log-out.png"></img>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    toast.querySelector(".toast_close").addEventListener("click", (e)=> removeToast(e.target.parentElement));
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}
