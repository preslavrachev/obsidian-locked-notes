import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

const VIEW_STATE_SOURCE = "source";

const VIEW_STATE_PREVIEW = "preview";
export default class LockedNotesPlugin extends Plugin {
	private handleDoubleClick(leaf: WorkspaceLeaf) {
		return () => {
			let viewState = leaf.getViewState();
			if (!viewState.state) {
				return;
			}

			viewState.state.mode = VIEW_STATE_SOURCE;
			leaf.setViewState(viewState);
		};
	}

	private handleEscapeKey(leaf: WorkspaceLeaf) {
		return (e: KeyboardEvent) => {
			if (e.keyCode === 27) {
				let viewState = leaf.getViewState();
				if (!viewState.state) {
					return;
				}

				viewState.state.mode = VIEW_STATE_PREVIEW;
				leaf.setViewState(viewState);
			}
		};
	}

	private attachEventHandlers(leaf: WorkspaceLeaf) {
		if (this.isActiveNote(leaf)) {
			leaf.view.containerEl.ondblclick = this.handleDoubleClick(leaf);
			leaf.view.containerEl.onkeydown = this.handleEscapeKey(leaf);
			this.lockLeaf(leaf);
		}
	}

	async onload() {
		// Initialize for all open notes
		this.app.workspace.iterateAllLeaves(leaf => {
			this.attachEventHandlers(leaf);
		});

		// Register handler for new notes
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", leaf => {
				this.attachEventHandlers(leaf as WorkspaceLeaf);
			})
		);
	}

	onunload() {
		this.app.workspace.iterateAllLeaves(leaf => {
			if (this.isActiveNote(leaf)) {
				leaf.view.containerEl.ondblclick = null;
				leaf.view.containerEl.onkeydown = null;
			}
		});
	}

	isActiveNote(leaf: WorkspaceLeaf): Boolean {
		let view = leaf.view instanceof MarkdownView ? leaf.view : null;
		return view !== null;
	}

	lockLeaf(leaf: WorkspaceLeaf) {
		let viewState = leaf.getViewState();
		if (!viewState.state) {
			return;
		}

		viewState.state.mode = VIEW_STATE_PREVIEW;
		leaf.setViewState(viewState);
	}
}

