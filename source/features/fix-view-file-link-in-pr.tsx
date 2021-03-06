import select from 'select-dom';
import delegate from 'delegate-it';
import * as pageDetect from 'github-url-detection';

import features from '.';

function handleMenuOpening(event: delegate.Event): void {
	const dropdown = event.delegateTarget.nextElementSibling!;

	// Only if it's not already there
	if (select.exists('.rgh-actionable-link', dropdown)) {
		return;
	}

	// Only enabled on Open/Draft PRs. Editing files doesn't make sense after a PR is closed/merged.
	if (!select.exists('.gh-header-meta [title$="Open"], .gh-header-meta [title$="Draft"]')) {
		return;
	}

	// If you're viewing changes from partial commits, ensure you're on the latest one.
	const isPartialCommits = select.exists('.js-commits-filtered');
	if (isPartialCommits && !select.exists('[aria-label="You are viewing the latest commit"]')) {
		return;
	}

	// This solution accounts for:
	// - Branches with slashes in it
	// - PRs opened from the default branch
	const headBranchUrl = select<HTMLAnchorElement>('.commit-ref.head-ref a')!.pathname;
	const viewFile = select<HTMLAnchorElement>('[data-ga-click^="View file"]', dropdown)!;
	const filepath = dropdown.closest<HTMLDivElement>('[data-path]')!.dataset.path;
	viewFile.pathname = headBranchUrl + '/' + String(filepath);

	viewFile.classList.add('rgh-actionable-link'); // Mark this as processed
}

function init(): void {
	delegate(document, '.file-header:not([data-file-deleted="true"]) .js-file-header-dropdown > summary', 'click', handleMenuOpening);
}

features.add({
	id: __filebasename,
	description: 'Points the "View file" in PRs to the branch instead of the commit, so the Edit/Delete buttons will be enabled on the "View file" page, if needed.',
	screenshot: false
}, {
	include: [
		pageDetect.isPRFiles,
		pageDetect.isPRCommit
	],
	init
});
