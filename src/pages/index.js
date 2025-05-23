import "./index.css";
import validation from "../scripts/validation.js";
import Api from "../utils/Api.js";

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
const cardDeleteModal = document.querySelector("#delete-modal");
const deleteForm = cardDeleteModal.querySelector(".modal__button-container");
const editModalNameInput = profileEditModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = profileEditModal.querySelector(
  "#profile-description-input"
);

const editProfileFormElement = profileEditModal.querySelector(".modal__form");

const cardEditModal = document.querySelector("#card-edit-modal");
const avatarEditModal = document.querySelector("#avatar-edit-modal");
const editProfileAvatarEL = document.querySelector(".avatar__edit-button");
const avatarModalClose = avatarEditModal.querySelector(".modal__close");
const saveAvatarBtn = avatarEditModal.querySelector(".modal__save-button");
const avatarInput = avatarEditModal.querySelector("#avatar-link-input");
const avatarForm = avatarEditModal.querySelector(".modal__form");
const addPostFormElement = cardEditModal.querySelector(".modal__form");
const cardModalCloseButton = cardEditModal.querySelector("#card-modal-close");
const cardLinkInput = cardEditModal.querySelector("#card-link-input");
const cardCaptionInput = cardEditModal.querySelector("#card-caption-input");
const imagePreviewModal = document.querySelector("#image-modal");
const previewModalCloseButton =
  imagePreviewModal.querySelector(".modal__close");

const previewImage = imagePreviewModal.querySelector(".modal__image");
const previewCaption = imagePreviewModal.querySelector(".modal__caption");
const cardSubmitBtn = cardEditModal.querySelector(".modal__save-button");
const deleteModalCloseButton = cardDeleteModal.querySelector(
  ".modal__close_type_delete"
);
const profileEditSaveBtn = profileEditModal.querySelector(
  ".modal__save-button"
);
const deleteButton = cardDeleteModal.querySelector(".modal__delete-btn");
const cancelButton = cardDeleteModal.querySelector(".modal__cancel-btn");

//Card related Elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

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

function handleAvatarEditFormSubmit(evt) {
  evt.preventDefault();

  saveAvatarBtn.textContent = "Saving...";

  api
    .changeProfileAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarEditModal);
      avatarForm.reset();
      validation.disableButton(saveAvatarBtn, validation.config);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      saveAvatarBtn.textContent = "Save";
    });
}

function handleProfileEditFormSubmit(evt) {
  evt.preventDefault();

  profileEditSaveBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(profileEditModal);
    })
    .catch(console.error)
    .finally(() => {
      profileEditSaveBtn.textContent = "Save";
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  cardSubmitBtn.textContent = "Saving...";

  api
    .createNewCard({ link: cardLinkInput.value, name: cardCaptionInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      validation.disableButton(cardSubmitBtn, validation.config);
      closeModal(cardEditModal);
      addPostFormElement.reset();
    })
    .catch(console.error)
    .finally(() => {
      cardSubmitBtn.textContent = "Save";
    });
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  const likeButton = evt.target;

  api
    .handleLike(id, isLiked)
    .then(() => {
      likeButton.classList.toggle("card__like-button_liked", !isLiked);
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__text");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeElement = cardElement.querySelector(".card__like-button");
  const cardDeleteElement = cardElement.querySelector(".card__delete-button");

  if (data.isLiked === true) {
    cardLikeElement.classList.add("card__like-button_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeElement.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardDeleteElement.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(imagePreviewModal);

    previewImage.src = data.link;
    previewCaption.textContent = data.name;
    previewImage.alt = data.name;
  });

  return cardElement;
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  deleteButton.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(cardDeleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteButton.textContent = "Delete";
    });
}
profileModalClose.addEventListener("click", () => {
  closeModal(profileEditModal);
});

editProfileFormElement.addEventListener("submit", handleProfileEditFormSubmit);

addPostFormElement.addEventListener("submit", handleAddCardSubmit);

avatarForm.addEventListener("submit", handleAvatarEditFormSubmit);

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

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(cardDeleteModal);
});

editProfileAvatarEL.addEventListener("click", () => {
  openModal(avatarEditModal);
});

avatarModalClose.addEventListener("click", () => {
  closeModal(avatarEditModal);
});

deleteButton.addEventListener("click", handleDeleteSubmit);

cancelButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  closeModal(cardDeleteModal);
});

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(cardDeleteModal);
}

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
