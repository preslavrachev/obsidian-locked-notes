import { MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';

const VIEW_STATE_SOURCE = "source";
const VIEW_STATE_PREVIEW = "preview";

export default class LockedNotesPlugin extends Plugin {
	private lockedNotes: Set<string> = new Set();

	private handleDoubleClick(leaf: WorkspaceLeaf) {
		return () => {
			let viewState = leaf.getViewState();
			if (!viewState.state) {
				return;
			}

			// Unlock the note when double-clicked
			const view = leaf.view as MarkdownView;
			if (view.file) {
				this.lockedNotes.delete(view.file.path);
			}

			viewState.state.mode = VIEW_STATE_SOURCE;
			leaf.setViewState(viewState);

			// Update button after mode change
			setTimeout(() => this.refreshLockButton(view), 100);
		};
	}

	private handleEscapeKey(leaf: WorkspaceLeaf) {
		return (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				let viewState = leaf.getViewState();
				if (!viewState.state) {
					return;
				}

				// Lock the note when escape is pressed
				const view = leaf.view as MarkdownView;
				if (view.file) {
					this.lockedNotes.add(view.file.path);
				}

				viewState.state.mode = VIEW_STATE_PREVIEW;
				leaf.setViewState(viewState);

				// Update button after mode change
				setTimeout(() => this.refreshLockButton(view), 100);
			}
		};
	}

	private addLockButton(view: MarkdownView) {
		// Remove any existing lock button first
		this.removeLockButton(view);

		const isLocked = this.isNoteLocked(view);
		const icon = isLocked ? 'lock' : 'unlock';
		const title = isLocked ? 'Unlock note (enable editing)' : 'Lock note (prevent editing)';

		const button = view.addAction(icon, title, () => {
			this.toggleNoteLock(view);
		});

		// Mark this as our lock button
		button.addClass('locked-notes-button');

		// Add color styling based on lock state
		this.applyButtonStyling(button, isLocked);

		// Try to hide the original reading/editing mode switcher
		setTimeout(() => this.hideOriginalModeSwitcher(view), 50);
	}

	private applyButtonStyling(button: HTMLElement, isLocked: boolean) {
		// Remove existing color classes
		button.removeClass('locked-notes-locked', 'locked-notes-unlocked');

		if (isLocked) {
			// Locked state - red color
			button.addClass('locked-notes-locked');
			button.style.color = '#e74c3c'; // Red color
		} else {
			// Unlocked state - green color
			button.addClass('locked-notes-unlocked');
			button.style.color = '#27ae60'; // Green color
		}
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

	private hideOriginalModeSwitcher(view: MarkdownView) {
		// Only hide if our lock button exists
		const ourButton = view.containerEl.querySelector('.locked-notes-button');
		if (!ourButton) {
			return; // Don't hide if our button isn't there
		}

		// Hide the original reading/editing mode switcher button
		// Try multiple selectors to catch different possible labels
		const selectors = [
			'.view-action[aria-label*="reading"]',
			'.view-action[aria-label*="editing"]',
			'.view-action[aria-label*="Reading"]',
			'.view-action[aria-label*="Editing"]',
			'.view-action[aria-label*="edit"]',
			'.view-action[aria-label*="Edit"]',
			'.view-action[aria-label*="preview"]',
			'.view-action[aria-label*="Preview"]',
			'.view-action svg.lucide-book',
			'.view-action svg.lucide-pencil',
			'.view-action svg.lucide-edit'
		];

		for (const selector of selectors) {
			const modeSwitcher = view.containerEl.querySelector(selector);
			if (modeSwitcher && !modeSwitcher.classList.contains('locked-notes-button')) {
				(modeSwitcher.closest('.view-action') as HTMLElement)?.style.setProperty('display', 'none', 'important');
			}
		}
	}

	private showOriginalModeSwitcher(view: MarkdownView) {
		// Show the original reading/editing mode switcher button
		const selectors = [
			'.view-action[aria-label*="reading"]',
			'.view-action[aria-label*="editing"]',
			'.view-action[aria-label*="Reading"]',
			'.view-action[aria-label*="Editing"]',
			'.view-action[aria-label*="edit"]',
			'.view-action[aria-label*="Edit"]',
			'.view-action[aria-label*="preview"]',
			'.view-action[aria-label*="Preview"]',
			'.view-action svg.lucide-book',
			'.view-action svg.lucide-pencil',
			'.view-action svg.lucide-edit'
		];

		for (const selector of selectors) {
			const modeSwitcher = view.containerEl.querySelector(selector);
			if (modeSwitcher) {
				(modeSwitcher.closest('.view-action') as HTMLElement)?.style.removeProperty('display');
			}
		}
	}

	private removeLockButton(view: MarkdownView) {
		const existingButton = view.containerEl.querySelector('.locked-notes-button');
		if (existingButton) {
			existingButton.remove();
		}
	}

	private refreshLockButton(view: MarkdownView) {
		// Use a longer delay to ensure Obsidian has finished its own updates
		setTimeout(() => {
			this.addLockButton(view);
		}, 300);
	}

	private setupNoteView(leaf: WorkspaceLeaf) {
		if (this.isActiveNote(leaf)) {
			const view = leaf.view as MarkdownView;

			// Add event handlers
			leaf.view.containerEl.ondblclick = this.handleDoubleClick(leaf);
			leaf.view.containerEl.onkeydown = this.handleEscapeKey(leaf);

			// Auto-lock new notes
			if (view.file && !this.lockedNotes.has(view.file.path)) {
				this.lockNote(view);
			}

			// Add lock button with enough delay for the view to be fully ready
			setTimeout(() => {
				this.addLockButton(view);
			}, 500);
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
		// Clean up event handlers and buttons
		this.app.workspace.iterateAllLeaves(leaf => {
			if (this.isActiveNote(leaf)) {
				const view = leaf.view as MarkdownView;

				// Remove event handlers
				leaf.view.containerEl.ondblclick = null;
				leaf.view.containerEl.onkeydown = null;

				// Remove lock button
				this.removeLockButton(view);

				// Restore original mode switcher
				this.showOriginalModeSwitcher(view);
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

