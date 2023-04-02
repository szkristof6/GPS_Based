export function openToast(text, title, type) {
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
}

export const redirect_time = 3 * 1000;
