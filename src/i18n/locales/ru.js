export default {
  common: {
    all: 'Все',
    cart: 'Корзина',
    add: 'Добавить',
    currency: 'сум',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    back: 'Назад',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Изменить',
  },

  menu: {
    title: 'Меню',
    total: 'вернуться к меню',
    loading: 'Загрузка меню...',
    photo: 'Фото блюда',
    noPhoto: 'Фото отсутствует',
    empty: 'Меню пока пустое',
    manage: 'Управление блюдами',
    noCategory: 'Без категории',

    fillAllNames: 'Заполните все три названия',
    categoryUpdateFailed: 'Не удалось изменить категорию',
    categoryCreateFailed: 'Не удалось создать категорию',
    deleteCategoryConfirm: 'Удалить категорию? Блюда этой категории тоже могут быть затронуты.',
    categoryDeleteFailed: 'Не удалось удалить категорию',
    deleteItemConfirm: 'Вы действительно хотите удалить это блюдо?',
    itemDeleteFailed: 'Не удалось удалить блюдо',
    variants: 'Варианты:',
    chooseVariant: 'Выберите вариант:',
    addToCart: 'Добавить в корзину',

    form: {
      addTitle: 'Добавить блюдо',
      editTitle: 'Изменить блюдо',

      photo: 'Фотография',
      choosePhoto: 'Нажмите, чтобы выбрать фотографию',

      nameRu: 'Название RU',
      nameUz: 'Название UZ',
      nameEn: 'Название EN',

      descriptionRu: 'Описание RU',
      descriptionUz: 'Описание UZ',
      descriptionEn: 'Описание EN',

      price: 'Цена',
      category: 'Категория',
      chooseCategory: 'Выберите категорию',
      newCategory: 'Новая категория',

      available: 'Блюдо доступно для заказа',

      cancel: 'Отмена',
      save: 'Сохранить',
      create: 'Создать',
      variantSectionTitle: 'Размеры / варианты',
      addVariant: 'Добавить вариант',
      emptyVariants: 'Если у блюда нет вариантов — оставь пустым.',
      variantName: 'Название',
      variantPrice: 'Цена',
    },
  },

  home: {
    cafeLabel: 'Кафе "Sug\'diyona"',
    notificationTitle: 'Получать уведомление?',
    notificationText: 'Мы сообщим вам, когда ваш заказ будет готов.',
    notificationEnable: 'Разрешить',
    notificationConnecting: 'Подключение...',
    notificationLater: 'Позже',
  },

  admin: {
    panel: 'Админ-панель',
    cafe: 'Тестовое кафе',
    controlPanel: 'Панель управления',
    management: 'Администрации',
    manageText: 'Управляйте заказами и меню вашего кафе.',
    orders: {
      title: 'Заказы',
      description: 'Просмотр новых заказов и управление их статусом.',
      open: 'Открыть заказы →',
      loading: 'Загрузка заказов...',
      empty: 'Заказов пока нет',
      order: 'Заказ',
      table: 'Столик',
      customer: 'Клиент',
      comment: 'Комментарий',
      items: 'Состав заказа',
      refresh: 'Обновить',
      accept: 'Принять заказ',
      finish: 'Завершить',
      defaultDish: 'Блюдо',
      status: {
        new: 'Новый',
        accepted: 'Принят',
        preparing: 'Готовится',
        ready: 'Готов',
        completed: 'Завершён',
        cancelled: 'Отменён',
      },
    },
    menu: {
      title: 'Меню',
      description: 'Добавление, изменение и удаление блюд.',
      open: 'Открыть меню →',
    },
    login: {
      title: 'Панель администрации',
      email: 'Email',
      password: 'Пароль',
      button: 'Войти',
      loading: 'Вход...',
    },
  },

  cart: {
    title: 'Корзина',
    empty: 'Корзина пуста',
    total: 'Итого',
    checkout: 'Оформить заказ',
  },

  order: {
    backToCart: 'Вернуться в корзину',
    title: 'Оформление заказа',
    subtitle: 'Заполните данные для заказа',

    name: 'Ваше имя',
    namePlaceholder: 'Например, Азиз',

    table: 'Столик',
    tablePlaceholder: 'Выберите столик',

    comment: 'Комментарий',
    commentPlaceholder: 'Например: без лука',

    items: 'Товаров',
    total: 'Итого',
    submit: 'Заказать',

    accepted: 'Заказ принят',
    preparing: 'Ваш заказ готовится',
    ready: 'Ваш заказ готов',

    validationName: 'Введите ваше имя',
    validationTable: 'Выберите столик',
    validationCart: 'Корзина пуста',
    submitError: 'Не удалось оформить заказ. Попробуйте ещё раз.',
    loading: 'Загрузка заказа...',
    loadError: 'Не удалось загрузить заказ',
    orderNumber: 'Заказ',
    tableTitle: 'Столик',
    status: {
      accepted: 'Заказ принят',
      waitingText: 'Ожидайте подтверждения',
      preparingTitle: 'Ваш заказ готовится',
      preparingText: 'Кухня уже занимается вашим заказом',
      readyTitle: 'Ваш заказ выдан! 🎉',
    
    },
  },
}