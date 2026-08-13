export default {
  common: {
    all: 'All',
    cart: 'Cart',
    add: 'Add',
    currency: 'UZS',
    loading: 'Loading...',
    error: 'Something went wrong',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
  },

  menu: {
    title: 'Menu',
    total: 'Back to menu',
    loading: 'Loading menu...',
    photo: 'Dish photo',
    noPhoto: 'No photo',
    empty: 'Menu is empty',
    manage: 'Dish management',
    noCategory: 'No category',

    fillAllNames: 'Fill in all three names',
    categoryUpdateFailed: 'Failed to update category',
    categoryCreateFailed: 'Failed to create category',
    deleteCategoryConfirm: 'Delete this category? Dishes in this category may also be affected.',
    categoryDeleteFailed: 'Failed to delete category',
    deleteItemConfirm: 'Are you sure you want to delete this dish?',
    itemDeleteFailed: 'Failed to delete dish',
    variants: 'Variants:',
    chooseVariant: 'Select a variant:',
    addToCart: 'Add to cart',

    form: {
      addTitle: 'Add dish',
      editTitle: 'Edit dish',

      photo: 'Photo',
      choosePhoto: 'Click to choose a photo',

      nameRu: 'Name RU',
      nameUz: 'Name UZ',
      nameEn: 'Name EN',

      descriptionRu: 'Description RU',
      descriptionUz: 'Description UZ',
      descriptionEn: 'Description EN',

      price: 'Price',
      category: 'Category',
      chooseCategory: 'Select category',
      newCategory: 'New Category',

      available: 'Dish available for ordering',

      cancel: 'Cancel',
      save: 'Save',
      create: 'Create',
      variantSectionTitle: 'Sizes / variants',
      addVariant: 'Add variant',
      emptyVariants: 'If the dish has no variants, leave it empty.',
      variantName: 'Name',
      variantPrice: 'Price',
    },
  },

  home: {
    cafeLabel: 'Cafe "Sug\'diyona"',
    notificationTitle: 'Receive a notification?',
    notificationText: 'We will notify you when your order is ready.',
    notificationEnable: 'Allow',
    notificationConnecting: 'Connecting...',
    notificationLater: 'Later',
  },

  admin: {
    panel: 'Admin panel',
    cafe: 'Test cafe',
    controlPanel: 'Control panel',
    management: 'Administration',
    manageText: 'Manage your cafe orders and menu.',
    orders: {
      title: 'Orders',
      description: 'View new orders and manage their status.',
      open: 'Open orders →',
      loading: 'Loading orders...',
      empty: 'No orders yet',
      order: 'Order',
      table: 'Table',
      customer: 'Customer',
      comment: 'Comment',
      items: 'Order details',
      refresh: 'Refresh',
      accept: 'Accept order',
      finish: 'Complete',
      defaultDish: 'Dish',
      status: {
        new: 'New',
        accepted: 'Accepted',
        preparing: 'Preparing',
        ready: 'Ready',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
    },
    menu: {
      title: 'Menu',
      description: 'Add, edit, and delete dishes.',
      open: 'Open menu →',
    },
    login: {
      title: 'Administration panel',
      email: 'Email',
      password: 'Password',
      button: 'Sign in',
      loading: 'Signing in...',
    },
  },

  cart: {
    title: 'Cart',
    empty: 'Your cart is empty',
    total: 'Total',
    checkout: 'Place order',
  },

  order: {
    backToCart: 'Back to cart',
    title: 'Place your order',
    subtitle: 'Fill in your order details',

    name: 'Your name',
    namePlaceholder: 'For example, Aziz',

    table: 'Table',
    tablePlaceholder: 'Select a table',

    comment: 'Comment',
    commentPlaceholder: 'For example: no onions',

    items: 'Items',
    total: 'Total',
    submit: 'Place order',

    accepted: 'Order accepted',
    preparing: 'Your order is being prepared',
    ready: 'Your order is ready',

    validationName: 'Enter your name',
    validationTable: 'Select a table',
    validationCart: 'Your cart is empty',
    submitError: 'Failed to place the order. Please try again.',
    loading: 'Loading order...',
    loadError: 'Could not load the order',
    orderNumber: 'Order',
    tableTitle: 'Table',
    status: {
      accepted: 'Order accepted',
      waitingText: 'Waiting for confirmation',
      preparingTitle: 'Your order is being prepared',
      preparingText: 'The kitchen is already working on your order',
      readyTitle: 'Your order is given! 🎉',
    },
  },
}