const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const cardNewPostButton = document.querySelector(".profile__new-button");

// Form Elements
const profileEditModal = document.querySelector(".profile-modal");
const editModalNameInput = profileEditModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = profileEditModal.querySelector(
  "#profile-description-input"
);

const editProfileFormElement = profileEditModal.querySelector(
  ".profile-modal__form"
);

const cardEditModal = document.querySelector(".card-modal");
const editModalLinkInput = document.querySelector("#card-link-input");
const editModalCaptionInput = document.querySelector("#card-caption-input");
const addPostFormElement = cardEditModal.querySelector(".card-modal__form");
const cardModalCloseButton = cardEditModal.querySelector(".card-modal__close");
const cardLinkInput = cardEditModal.querySelector("#card-link-input");
const cardCaptionInput = cardEditModal.querySelector("#card-caption-input");

//Card related Elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

const profileModalClose = profileEditModal.querySelector(
  ".profile-modal__close"
);
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleProfileEditFormSubmit(evt) {
  evt.preventDefault();

  profileDescription.textContent = editModalDescriptionInput.value;
  profileName.textContent = editModalNameInput.value;

  closeModal(profileEditModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: cardCaptionInput.value,
    link: cardLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(cardEditModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__text");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeElement = cardElement.querySelector(".card__like-button");
  const cardDeleteElement = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeElement.addEventListener("click", () => {
    cardLikeElement.classList.toggle("card__like-button_liked");
  });

  cardDeleteElement.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});

profileModalClose.addEventListener("click", () => {
  closeModal(profileEditModal);
});

editProfileFormElement.addEventListener("submit", handleProfileEditFormSubmit);

addPostFormElement.addEventListener("submit", handleAddCardSubmit);

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardEditModal);
});

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(profileEditModal);
});

cardNewPostButton.addEventListener("click", () => {
  openModal(cardEditModal);
});
