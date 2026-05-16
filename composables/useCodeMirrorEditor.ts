import { ref, shallowRef, watch, nextTick, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { useEditorStore } from '~/stores/editor'
import { useFullScreenStore } from '~/stores/fullScreenStore'

export function useCodeMirrorEditor(
  editorContainer: Ref<HTMLElement | null>,
  isDarkMode: Ref<boolean>,
  liveRun: Ref<boolean>,
  isAILoading: Ref<boolean>,
  userHasScrolledUp: Ref<boolean>,
  runCode: () => void
) {
  const editorStore = useEditorStore()
  const fullScreenStore = useFullScreenStore()
  const editorView = shallowRef<EditorView | null>(null)

  const setupEditor = () => {
    if (!editorContainer.value) return;
    
    const extensions = [
      basicSetup,
      html(),
      EditorView.theme({
        "&": {
          backgroundColor: isDarkMode.value ? "#282c34" : "#ffffff",
          color: isDarkMode.value ? "#abb2bf" : "#24292e",
          height: "100%",
          overflow: "auto"
        },
        ".cm-content": {
          caretColor: isDarkMode.value ? "#528bff" : "#000000"
        },
        ".cm-cursor": {
          borderLeftColor: isDarkMode.value ? "#528bff" : "#000000"
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: isDarkMode.value ? "#528bff" : "#000000"
        },
        ".cm-selectionBackground": {
          backgroundColor: isDarkMode.value ? "#3E4451" : "#b3d4fc"
        },
        ".cm-gutters": {
          backgroundColor: isDarkMode.value ? "#282c34" : "#f6f8fa",
          color: isDarkMode.value ? "#495162" : "#6e7781",
          border: "none"
        },
        ".cm-scroller": {
          scrollbarWidth: "thin",
          scrollbarColor: isDarkMode.value ? "#4b5563 transparent" : "#cbd5e1 transparent"
        },
        ".cm-scroller::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        ".cm-scroller::-webkit-scrollbar-track": {
          background: "transparent",
        },
        ".cm-scroller::-webkit-scrollbar-thumb": {
          background: isDarkMode.value ? "#4b5563" : "#cbd5e1",
          borderRadius: "10px",
        },
        ".cm-scroller::-webkit-scrollbar-thumb:hover": {
          background: isDarkMode.value ? "#6b7280" : "#94a3b8",
        }
      }),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString();
          editorStore.setHtmlCode(newValue);
          
          if (liveRun.value) {
            runCode();
          }
        }
      })
    ];
    
    watch(() => editorStore.fullscreenSwitch, async () => {
      await nextTick();
      if (editorView.value) {
        setTimeout(() => {
          if (editorView.value) {
            editorView.value.requestMeasure();
            const view = editorView.value;
            view.dispatch({});
          }
        }, 100);
      }
    });

    if (isDarkMode.value) {
      extensions.push(oneDark);
    }
    
    const startState = EditorState.create({
      doc: editorStore.htmlCode,
      extensions: extensions
    });

    editorView.value = new EditorView({
      state: startState,
      parent: editorContainer.value
    });

    editorView.value.scrollDOM.style.height = "100%";
    editorView.value.scrollDOM.style.overflow = "auto";

    editorView.value.scrollDOM.addEventListener('scroll', () => {
      if (!editorView.value) return;
      const { scrollTop, scrollHeight, clientHeight } = editorView.value.scrollDOM;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isAILoading.value && !isAtBottom) {
        userHasScrolledUp.value = true;
      } else if (isAtBottom) {
        userHasScrolledUp.value = false;
      }
    });
  }

  watch(() => editorStore.htmlCode, (newValue) => {
    if (editorView.value && newValue !== editorView.value.state.doc.toString()) {
      const view = editorView.value;
      const currentScrollTop = view.scrollDOM.scrollTop;
      
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newValue
        },
        userEvent: 'input'
      });

      if (isAILoading.value) {
        if (!userHasScrolledUp.value) {
          nextTick(() => {
            view.scrollDOM.scrollTop = view.scrollDOM.scrollHeight;
          });
        }
      } else {
        view.scrollDOM.scrollTop = currentScrollTop;
      }
    }
  });

  watch(isDarkMode, async () => {
    if (editorView.value) {
      const selection = editorView.value.state.selection;
      
      editorView.value.destroy();
      await nextTick();
      setupEditor();
      
      if (editorView.value) {
        try {
          editorView.value.dispatch({
            selection: selection as any
          });
        } catch (e) {
          console.warn('Could not restore selection after theme change', e);
        }
      }

      editorView.value.scrollDOM.style.height = "100%";
      editorView.value.scrollDOM.style.overflow = "auto";
    }
  });

  watch(() => fullScreenStore.isEditorFullscreen, async () => {
    await nextTick()
    if (editorView.value) {
      setTimeout(() => {
        if (editorView.value) {
          editorView.value.requestMeasure()
          const view = editorView.value
          view.dispatch({})
        }
      }, 100)
    }
  })

  onMounted(() => {
    nextTick(() => {
      setupEditor();
    });
  });

  onUnmounted(() => {
    if (editorView.value) {
      editorView.value.destroy();
    }
  });

  return {
    editorView
  }
}
