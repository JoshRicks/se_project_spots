import "./index.css";
import validation from "../scripts/validation.js";
import Api from "../utils/Api.js";

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
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "392da7a8-ead8-4180-ae63-2b9b8f49820f",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });

    profileAvatar.src = user.avatar;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
  })
  .catch(console.error);

// Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const cardNewPostButton = document.querySelector(".profile__new-button");
const profileAvatar = document.querySelector(".profile__image");

// Form Elements
const profileEditModal = document.querySelector("#profile-edit-modal");
const editModalNameInput = profileEditModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = profileEditModal.querySelector(
  "#profile-description-input"
);

const editProfileFormElement = profileEditModal.querySelector(".modal__form");

const cardEditModal = document.querySelector("#card-edit-modal");
const editModalLinkInput = cardEditModal.querySelector("#card-link-input");
const editModalCaptionInput = cardEditModal.querySelector(
  "#card-caption-input"
);
const addPostFormElement = cardEditModal.querySelector(".modal__form");
const cardModalCloseButton = cardEditModal.querySelector("#card-modal-close");
const cardLinkInput = cardEditModal.querySelector("#card-link-input");
const cardCaptionInput = cardEditModal.querySelector("#card-caption-input");
const imagePreviewModal = document.querySelector("#image-modal");
const previewModalCloseButton =
  imagePreviewModal.querySelector(".modal__close");

const previewImage = imagePreviewModal.querySelector(".modal__image");
const previewCaption = imagePreviewModal.querySelector(".modal__caption");
const modalSubmitButton = cardEditModal.querySelector(".modal__save-button");

//Card related Elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//Modal Element
const modals = document.querySelectorAll(".modal");

validation.enableValidation(validation.config);

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

const profileModalClose = profileEditModal.querySelector(
  "#profile-modal-close"
);
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleProfileEditFormSubmit(evt) {
  evt.preventDefault();

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
    })
    .catch(console.error);

  closeModal(profileEditModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  api
    .createNewCard({ link: cardLinkInput.value, name: cardCaptionInput.value })
    .then((data) => {
      const inputValues = {
        name: data.name,
        link: data.link,
      };
      const cardElement = getCardElement(inputValues);
      cardsList.prepend(cardElement);
      disableButton(modalSubmitButton, validation.config);
      const form = evt.currentTarget.closest(`form`);
      if (form) {
        form.reset();
      }
    })
    .catch(console.error);

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

  cardImageElement.addEventListener("click", () => {
    openModal(imagePreviewModal);

    previewImage.src = data.link;
    previewCaption.textContent = data.name;
    previewImage.alt = data.name;
  });

  return cardElement;
}

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
  validation.resetValidation(
    editProfileFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validation.config
  );
  openModal(profileEditModal);
});

cardNewPostButton.addEventListener("click", () => {
  openModal(cardEditModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(imagePreviewModal);
});

modals.forEach((modal) => {
  modal.addEventListener("click", function (evt) {
    if (
      modal.classList.contains("modal_opened") &&
      evt.target.classList.contains("modal")
    ) {
      closeModal(modal);
    }
  });
});

function handleEscape(evt) {
  if (evt.key === `Escape`) {
    const openedPopup = document.querySelector(".modal_opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}
