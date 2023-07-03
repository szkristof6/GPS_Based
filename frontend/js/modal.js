const modal = document.querySelector(".modal");

modal.addEventListener("click", (e) => closeModal(e));

export function openModal(event) {
    const { id } = event.target;

    modal.querySelector(".id").value = id;

    modal.classList.add("m_open");
}

export function closeModal(event) {
	const { target } = event;
	if (target.classList.contains("modal")) {
		target.classList.remove("m_open");
	}
}


