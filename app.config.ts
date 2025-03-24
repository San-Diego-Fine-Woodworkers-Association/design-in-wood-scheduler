export default defineAppConfig({
  ui: {
    modal: {
      slots: {
        footer: 'flex justify-end items-center',
        title: 'font-semibold font-serif',
        body: 'bg-(--color-early-dawn-50)'
      }
    },

    button: {
      compoundVariants: [
        {
          color: 'neutral',
          variant: 'outline',
          class: 'disabled:bg-black/50 disabled:text-white/75'
        }
      ]
    },

    colors: {
      primary: 'blue'
    }
  }
})
