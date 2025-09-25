import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

const VIEW_STATE_SOURCE = "source";
const VIEW_STATE_PREVIEW = "preview";

export default class LockedNotesPlugin extends Plugin {
	private lockedNotes: Set<string> = new Set();

	private addLockButton(view: MarkdownView) {
		const isLocked = this.isNoteLocked(view);
		const icon = isLocked ? 'lock' : 'unlock';
		const title = isLocked ? 'Unlock note (enable editing)' : 'Lock note (prevent editing)';

		view.addAction(icon, title, () => {
			this.toggleNoteLock(view);
		});
	}

	private toggleNoteLock(view: MarkdownView) {
		const filePath = view.file?.path;
		if (!filePath) return;

		if (this.isNoteLocked(view)) {
			this.unlockNote(view);
		} else {
			this.lockNote(view);
		}

		// Refresh the button by re-adding it
		this.refreshLockButton(view);
	}

	private lockNote(view: MarkdownView) {
		const filePath = view.file?.path;
		if (!filePath) return;

		this.lockedNotes.add(filePath);
		this.setViewMode(view, VIEW_STATE_PREVIEW);
	}

	private unlockNote(view: MarkdownView) {
		const filePath = view.file?.path;
		if (!filePath) return;

		this.lockedNotes.delete(filePath);
		this.setViewMode(view, VIEW_STATE_SOURCE);
	}

	private isNoteLocked(view: MarkdownView): boolean {
		return view.file?.path ? this.lockedNotes.has(view.file.path) : false;
	}

	private setViewMode(view: MarkdownView, mode: string) {
		const leaf = view.leaf;
		let viewState = leaf.getViewState();
		if (!viewState.state) {
			return;
		}

		viewState.state.mode = mode;
		leaf.setViewState(viewState);
	}

	private refreshLockButton(view: MarkdownView) {
		// Remove existing lock button
		const existingButton = view.containerEl.querySelector('.view-action[aria-label*="lock"], .view-action[aria-label*="Lock"], .view-action[aria-label*="Unlock"]');
		if (existingButton) {
			existingButton.remove();
		}

		// Add new button with updated state
		this.addLockButton(view);
	}

	private setupNoteView(leaf: WorkspaceLeaf) {
		if (this.isActiveNote(leaf)) {
			const view = leaf.view as MarkdownView;
			this.addLockButton(view);

			// Auto-lock new notes
			if (view.file && !this.lockedNotes.has(view.file.path)) {
				this.lockNote(view);
				this.refreshLockButton(view);
			}
		}
	}

	async onload() {
		// Initialize for all open notes
		this.app.workspace.iterateAllLeaves(leaf => {
			this.setupNoteView(leaf);
		});

		// Register handler for new notes
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", leaf => {
				if (leaf) {
					this.setupNoteView(leaf as WorkspaceLeaf);
				}
			})
		);
	}

	onunload() {
		// Clean up lock buttons
		this.app.workspace.iterateAllLeaves(leaf => {
			if (this.isActiveNote(leaf)) {
				const existingButton = leaf.view.containerEl.querySelector('.view-action[aria-label*="lock"], .view-action[aria-label*="Lock"], .view-action[aria-label*="Unlock"]');
				if (existingButton) {
					existingButton.remove();
				}
			}
		});

		// Clear locked notes set
		this.lockedNotes.clear();
	}

	isActiveNote(leaf: WorkspaceLeaf): Boolean {
		let view = leaf.view instanceof MarkdownView ? leaf.view : null;
		return view !== null;
	}

}

