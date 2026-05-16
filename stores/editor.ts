import { defineStore } from 'pinia'
import { LANDING_PAGE_HTML } from '../utils/landing'
import { SYSTEM_PROMPT } from '~/shared/prompt'

interface EditorState {
  htmlCode: string;
  systemPrompt: string;
  liveRun: boolean;
  isOutputDark: boolean;
  isEditorFullscreen: boolean;
  isOutputFullscreen: boolean;
  fullscreenSwitch: number;
  refreshCounter: number;
  aiFixRequested: string | null;
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    htmlCode: LANDING_PAGE_HTML,
    systemPrompt: SYSTEM_PROMPT,
    liveRun: true,
    isOutputDark: false,
    isEditorFullscreen: false,
    isOutputFullscreen: false,
    fullscreenSwitch: 0, // New counter to trigger fullscreen events
    refreshCounter: 0, // Counter to trigger output refresh
    aiFixRequested: null,
  }),
  actions: {
    setHtmlCode(code: string) {
      this.htmlCode = code
    },
    setSystemPrompt(prompt: string) {
      this.systemPrompt = prompt
    },
    resetSystemPrompt() {
      this.systemPrompt = SYSTEM_PROMPT
    },
    setLiveRun(value: boolean) {
      this.liveRun = value
    },
    // ... rest of the actions
    setOutputDark(value: boolean) {
      this.isOutputDark = value
    },
    setEditorFullscreen(value: boolean) {
      this.isEditorFullscreen = value
      if (value) this.isOutputFullscreen = false
    },
    setOutputFullscreen(value: boolean) {
      this.isOutputFullscreen = value
      if (value) this.isEditorFullscreen = false
    },
    toggleEditorFullscreen() {
      this.isEditorFullscreen = !this.isEditorFullscreen
      if (this.isEditorFullscreen) this.isOutputFullscreen = false
    },
    toggleOutputFullscreen() {
      this.isOutputFullscreen = !this.isOutputFullscreen
      if (this.isOutputFullscreen) this.isEditorFullscreen = false
    },
    // New action to trigger fullscreen panel switching
    triggerFullscreenSwitch(targetPanel: 'editor' | 'output') {
      if (targetPanel === 'editor') {
        this.isOutputFullscreen = false;
        this.isEditorFullscreen = true;
      } else if (targetPanel === 'output') {
        this.isEditorFullscreen = false;
        this.isOutputFullscreen = true;
      }
      this.fullscreenSwitch++; // Increment to watchers
    },
    triggerRefresh() {
      this.refreshCounter++;
    },
    requestAIFix(errors: string) {
      this.aiFixRequested = errors;
    },
    clearAIFix() {
      this.aiFixRequested = null;
    }
  },
  persist: {
    // @ts-ignore
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['htmlCode', 'liveRun', 'isOutputDark', 'systemPrompt'],
  },
})
