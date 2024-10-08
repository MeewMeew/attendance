import 'highlight.js/styles/github.css'

import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import type { Plugin } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const component = defineComponent({
  props: {
    className: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: ''
    },
    autodetect: {
      type: Boolean,
      default: true
    },
    ignoreIllegals: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const language = ref(props.language)
    watch(
      () => props.language,
      (newLanguage) => {
        language.value = newLanguage
      }
    )

    const autodetect = computed(() => props.autodetect || !language.value)
    const cannotDetectLanguage = computed(
      () => !autodetect.value && !hljs.getLanguage(language.value)
    )

    const className = computed((): string => {
      if (cannotDetectLanguage.value) {
        return ''
      } else {
        return `hljs ${language.value} ${props.className}`
      }
    })

    const highlightedCode = computed((): string => {
      // No idea what language to use, return raw code
      if (cannotDetectLanguage.value) {
        console.warn(`The language "${language.value}" you specified could not be found.`)
        return escapeHtml(props.code)
      }

      if (autodetect.value) {
        const result = hljs.highlightAuto(props.code)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        language.value = result.language ?? ''
        return result.value
      } else {
        const result = hljs.highlight(props.code, {
          language: language.value,
          ignoreIllegals: props.ignoreIllegals
        })
        return result.value
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      className,
      highlightedCode
    }
  },
  render() {
    return h('pre', {}, [
      h('code', {
        class: this.className,
        innerHTML: this.highlightedCode,
        tabindex: '0'
      })
    ])
  }
})

const plugin: Plugin & { component: typeof component } = {
  install(app) {
    app.component('Highlight', component)
  },
  component
}

export default plugin
