<script lang="ts">
  export let segment: string;
  import authStore from "../../stores/auth.store";
  import projectStore from "../../stores/project.store";
  import { isPathOnHomePage } from "../../helpers/is-path-on-homepage";
  import { fade } from "svelte/transition";
  import { stores, goto } from "@sapper/app";
  import { logout } from "../../firebase/auth";
  import { loadNewProjectFile } from "../../helpers/open-project-file";
  import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop,
  } from "../../core/blockly/helpers/arduino_loop_block.helper";
  import { resetWorkspace } from "../../core/blockly/helpers/workspace.helper";
  import { saveProject } from "../../firebase/db";
  import { wait } from "../../helpers/wait";
  import { onConfirm, onErrorMessage } from "../../help/alerts";

  let isOpeningFile = false;
  let fileUpload;
  let canSave = true;
  let showSaveSuccess = false;

  const { page } = stores();

  let params = "";

  projectStore.subscribe((p) => {
    if (p.projectId) {
      params = `?projectid=${p.projectId}`;
    } else {
      params = "";
    }
  });

  async function onNewFileAuth() {
    if (!$projectStore.project) {
      onNewFileNoAuth();
      return;
    }

    const confirmNewFile = await onConfirm(
      "We are about to save your current project and create a new one? Would you like to continue?"
    );

    if (!confirmNewFile) {
      return;
    }
    try {
      await saveProject($projectStore.project, $projectStore.projectId);
      projectStore.set({ projectId: null, project: null });
      await goto("/");
      resetWorkspace();
    } catch (e) {
      onErrorMessage("Error saving your project please try agian.", e);
    }
  }

  async function onNewFileNoAuth() {
    const confirmNewFile = await onConfirm(
      "You are creating a new file, which will delete your work.  Would you like to continue?"
    );
    if (!confirmNewFile) {
      return;
    }

    resetWorkspace();
  }

  async function onSaveClick() {
    if (!$projectStore.projectId) {
      await goto("/project-settings");
      return;
    }

    if (!canSave) return;
    try {
      await saveProject($projectStore.project, $projectStore.projectId);
      showSaveSuccess = true;
      await wait(1500);
      canSave = true;
      showSaveSuccess = false;
    } catch (e) {
      onErrorMessage("Error saving your project please try agian.", e);
    }
  }

  async function onSignOut() {
    try {
      await logout();
    } catch (e) {
      onErrorMessage("Please try again in 5 minutes", e);
    }
  }

  async function openFile(e) {
    isOpeningFile = true;
    const file = fileUpload.files[0];
    if (!file) {
      return;
    }

    try {
      await loadNewProjectFile(file);
    } catch (e) {
      onErrorMessage("Please make sure you uploaded a valid file.", e);
    }

    isOpeningFile = false;
    if (isPathOnHomePage($page.path)) {
      arduinoLoopBlockShowNumberOfTimesThroughLoop();
    } else {
      arduinoLoopBlockShowLoopForeverText();
    }
  }
</script>

<nav class:small={!$authStore.isLoggedIn}>
  {#if $authStore.isLoggedIn}
    
    <a href="/{params}" class:active={isPathOnHomePage($page.path)}>
      <i class="fa fa-home" />
    </a>

    <a href="/code{params}" class:active={$page.path.includes('code')}>
      <i class="fa fa-code" />
    </a>
    <a href="/arduino{params}" class:active={$page.path.includes('arduino')}>
      <i class="fa fa-microchip" />
    </a>

    <a href="/open" class:active={segment === 'open'}>
      <i
        class="fa "
        class:fa-folder-open-o={segment !== 'open'}
        class:fa-folder-open={segment === 'open'}
      />
    </a>
    <span on:click={onNewFileAuth}> <i class="fa fa-file-o" /> </span>
    <span on:click={onSaveClick}><i class="fa fa-floppy-o" /></span>
    <a
      href="/project-settings"
      class:active={$page.path.includes('project-settings')}
    >
      <i class="fa fa-wrench" aria-hidden="true" />
    </a>
    <a href="/settings" class:active={segment === 'settings'}>
      <i class="fa fa-gears" />
    </a>
    <span on:click={onSignOut}>
      <i class="fa fa-sign-out" title="Sign Out" aria-hidden="true" />
    </span>
  {/if}

  {#if !$authStore.isLoggedIn}
    <a href="/" class:active={isPathOnHomePage($page.path)}>
      <i class="fa fa-home" />
    </a>

    <a href="/code" class:active={$page.path.includes('code')}>
      <i class="fa fa-code" />
    </a>
    <a href="/arduino" class:active={$page.path.includes('arduino')}>
      <i class="fa fa-microchip" />
    </a>

    <label class:active={segment === 'open'}>
      <i
        class="fa "
        class:fa-folder-open-o={!isOpeningFile}
        class:fa-folder-open={isOpeningFile}
      />
      <input
        on:change={openFile}
        type="file"
        accept="text/xml"
        style="display:none"
        bind:this={fileUpload}
      />
    </label>
    <span on:click={onNewFileNoAuth} class="active">
      <i class="fa fa-file-o" />
    </span>
    <a href="/download" class:active={segment === 'download'}>
      <i class="fa fa-download" />
    </a>
    <a href="/settings" class:active={segment === 'settings'}>
      <i class="fa fa-gears" />
    </a>
    <a href="/login" class:active={segment === 'login'}>
      <i class="fa fa-sign-in" />
    </a>
  {/if}
</nav>
{#if showSaveSuccess}
  <p transition:fade id="saved">project saved</p>
{/if}

<style>
  nav {
    width: 100%;
    overflow: auto;
    border-bottom: 1px solid gray;
    height: 56px;
  }

  nav .fa {
    color: #505bda;
  }

  nav a .fa,
  nav span .fa,
  nav .disabled .fa {
    opacity: 0.5;
  }

  nav .active .fa {
    color: #505bda !important;
    opacity: 1;
  }

  nav a,
  nav span,
  label {
    float: left;
    width: 11.11111%;
    text-align: center;
    padding: 2px 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 3rem;
    cursor: pointer;
    line-height: 1px;
    margin-bottom: 0;
    margin-top: 3px;
  }
  nav.small a,
  nav.small span,
  nav.small label {
    width: 12.5%;
  }
  #saved {
    position: absolute;
    left: 50%;
    top: 100px;
    background: #2c75e6;
    text-align: center;
    vertical-align: middle;
    padding: 10px;
    transform: translateX(-50%);
    z-index: 21;
    color: #fff;
  }
</style>
