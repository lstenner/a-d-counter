document.addEventListener('DOMContentLoaded', () => {
    let aCount = 0; // Counter for 'A' key presses
    let dCount = 0; // Counter for 'D' key presses
    let canCountA = true; // Flag to allow counting 'A'
    let canCountD = true; // Flag to allow counting 'D'
    let countingStarted = false; // Flag to start counting once a key is pressed
    let countingFinished = false; // Flag to stop counting after 10 seconds
    let startTime = Date.now(); // Start time of the first key press
    let interval = null; // Interval to update the A/D per minute display
    let falseKeys = [
        'w', 'W', 's', 'S'
    ]; // Array of keys that are not 'A' or 'D'
    let missClicks = 0; // Counter for missclicks
    let duration = 10; // Duration of the test in seconds

    // Function to update the A/D per minute and Missclicks per minute display
    const updateCounter = () => {
        if (!countingStarted) return; // Don't update if counting hasn't started

        const elapsedTime = Date.now() - startTime; // Calculate elapsed time in milliseconds
        const minutes = elapsedTime / 60000; // Convert milliseconds to minutes

        // Avoid division by zero and calculate A/D per minute
        const adPerMinute = minutes > 0 ? ((aCount + dCount) / minutes).toFixed(2) : 0;
        
        // Calculate Missclicks per minute
        const missClicksPerMinute = minutes > 0 ? (missClicks / minutes).toFixed(2) : 0;

        // Update the DOM elements for A/D per minute and Missclicks
        document.getElementById('counter').innerText = `A/D per minute: ${adPerMinute}`;
        document.getElementById('missclicks').innerText = `Missclicks: ${missClicks} (Missclicks per minute: ${missClicksPerMinute})`;

        // Stop counting after {duration} seconds
        if (elapsedTime >= duration * 1000) {
            countingStarted = false;
            document.getElementById('counter').innerText = `Final A/D per minute: ${adPerMinute}`;
            document.getElementById('missclicks').innerText = `Final Missclicks: ${missClicks} (Missclicks per minute: ${missClicksPerMinute})`;
            countingFinished = true;
            clearInterval(interval);
        }
    };


    document.addEventListener('keydown', (event) => {
        if (!countingStarted && !countingFinished) {
            // Start counting and timer updates on first key press
            countingStarted = true;
            startTime = Date.now(); // Reset start time to now
            interval = setInterval(updateCounter, 10); // Update the counter
        }

        // Implement blockade logic
        if ((event.key === 'a' || event.key === 'A') && canCountA) {
            aCount++;
            canCountA = false; // Reset 'A' counting
            canCountD = true; // Allow 'D' to be counted next
        } else if ((event.key === 'd' || event.key === 'D') && canCountD) {
            dCount++;
            canCountD = false; // Reset 'D' counting
            canCountA = true; // Allow 'A' to be counted next
        }

        // Implement missclick logic
        if (falseKeys.includes(event.key)) {
            missClicks++;
        }
    });
});
