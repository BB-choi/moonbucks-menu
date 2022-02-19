const $ = (selector) => document.querySelector(selector);

const isEmpty = (input) => {
    return Boolean(!input.value.length);
};

const createMenuListItem = (menuName) => {
    return `<li class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name">${menuName}</span>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
      수정
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
    >
      삭제
    </button>
  </li>`;
};

const clearInputValue = (input) => {
    input.value = "";
};

const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").childElementCount;
    $(".menu-count").innerText = `총 ${menuCount}개`;
};

const renderMenus = (menus) => {
    let menuList = menus.reduce(
        (prev, cur) => createMenuListItem(cur) + prev,
        ""
    );
    $("#espresso-menu-list").insertAdjacentHTML("beforeend", menuList);
};

const setLocalStorage = (category, newMenu) => {
    let items = [];
    if (localStorage.getItem(category)) {
        items = JSON.parse(localStorage.getItem(category));
    }
    localStorage.setItem(category, JSON.stringify([...items, newMenu]));
};

const getLocalStorage = (category) => {
    if (!localStorage.getItem(category)) return;

    let items = JSON.parse(localStorage.getItem(category));
    if (!items.length) return;
    renderMenus(items);
    updateMenuCount();
};

const addMenuName = () => {
    const menuNameInput = $("#espresso-menu-name");

    if (isEmpty($("#espresso-menu-name"))) return;

    const menuListItem = createMenuListItem(menuNameInput.value);
    $("#espresso-menu-list").insertAdjacentHTML("beforeend", menuListItem);

    setLocalStorage("espresso", menuNameInput.value);
    clearInputValue(menuNameInput);
    updateMenuCount();
};

const updateMenuName = (menuEditBtn) => {
    const parentEl = menuEditBtn.parentElement;
    const curMenuName = parentEl.querySelector(".menu-name");
    const newMenuName = prompt(
        "새로운 메뉴 이름을 입력하세요.",
        curMenuName.innerText
    );

    if (!newMenuName) return;
    curMenuName.innerText = newMenuName;
};

// TODO: 삭제시에도 localStorage에 반영
const removeMenuName = (menuRemoveBtn) => {
    const curListItem = menuRemoveBtn.parentElement;
    const curMenuName = curListItem.querySelector("span").innerText;
    if (confirm(`선택한 메뉴("${curMenuName}")를 삭제하시겠습니까?`)) {
        $("#espresso-menu-list").removeChild(curListItem);
        updateMenuCount();
    }
};

const initEventListeners = () => {
    $("#espresso-menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
        addMenuName();
    });

    $("#espresso-menu-list").addEventListener("click", (e) => {
        if (e.target.classList.contains("menu-edit-button")) {
            updateMenuName(e.target);
            return;
        }

        if (e.target.classList.contains("menu-remove-button")) {
            removeMenuName(e.target);
            return;
        }
    });
};

const init = () => {
    initEventListeners();
    // 초기화면(espresso)의 메뉴들을 가져옴
    getLocalStorage("espresso");
};

init();
