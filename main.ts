import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

export default class LockedNotesPlugin extends Plugin {
	async onload() {
		this.app.workspace.iterateAllLeaves(leaf => {
			if (this.isActiveNote(leaf)) {
				leaf.view.containerEl.ondblclick = (e: any) => {
					let viewState = leaf.getViewState();
					viewState.state.mode = "source";
					leaf.setViewState(viewState);
				};
				leaf.view.containerEl.onkeydown = (e) => {
					if (e.keyCode == 27) {
						let viewState = leaf.getViewState();
						viewState.state.mode = "preview";
						leaf.setViewState(viewState);
					}
				};
				this.lockLeaf(leaf);
			}
		});
		this.registerEvent(
			this.app.workspace.on(
				"active-leaf-change", leaf => {
					let l = leaf as WorkspaceLeaf
					if (this.isActiveNote(l)) {
						l.view.containerEl.ondblclick = (e: any) => {
							//console.log("dblclick");
							let viewState = l.getViewState();
							viewState.state.mode = "source";
							l.setViewState(viewState);
						};

						l.view.containerEl.onkeydown = (e) => {
							if (e.keyCode == 27) {
								let viewState = l.getViewState();
								viewState.state.mode = "preview";
								l.setViewState(viewState);
							}
						};

						this.lockLeaf(l);
					}
				}
			)
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
		if (view === null) {
			return false;
		}

		return true;
	}

	lockLeaf(leaf: WorkspaceLeaf) {
		let viewState = leaf.getViewState();
		viewState.state.mode = "preview";
		leaf.setViewState(viewState);
	}
}
