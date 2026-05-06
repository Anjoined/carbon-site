// Social Media Sharing Functions

function shareToTwitter(title, url) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank');
}

function shareToFacebook(url) {
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
}

function shareToLinkedIn(title, url) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`, '_blank');
}

function copyShareLink(url) {
    var i18n = window.__i18n || {};
    navigator.clipboard.writeText(url)
        .then(() => {
            alert(i18n.linkCopied || 'Link copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy link:', err);
            alert(i18n.linkCopyFailed || 'Failed to copy link. Please try manually.');
        });
}

// Optional: Add share functionality to calculator results
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a calculator page and results are shown
    const resultsElement = document.getElementById('results');
    if (resultsElement) {
        // You could add a share button specifically for calculator results
        // This is a placeholder for future enhancement
    }
});
