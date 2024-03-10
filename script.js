document.addEventListener('DOMContentLoaded', () => {
    let aCount = 0; // Counter for 'A' key presses
    let dCount = 0; // Counter for 'D' key presses
    let clickTimes = []; // Array to store the timestamp of each click
    let canCountA = true; // Flag to allow counting 'A'
    let canCountD = true; // Flag to allow counting 'D'
    let countingStarted = false; // Flag to start counting once a key is pressed
    let countingFinished = false; // Flag to stop counting after 10 seconds
    let startTime = Date.now(); // Start time of the first key press
    let interval = null; // Interval to update the A/D per minute display
    let falseKeys = ['w', 'W', 's', 'S']; // Array of keys that are not 'A' or 'D'
    let missClicks = 0; // Counter for missclicks
    let duration = 10; // Duration of the test in seconds
    let averageTimeBetweenClicks = 0; // Average time between clicks

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

        // Calculate and display average time between clicks
        if (clickTimes.length > 1) {
            const timeDiffs = clickTimes.slice(1).map((time, index) => time - clickTimes[index]);
            averageTimeBetweenClicks = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
            document.getElementById('averageTime').innerText = `Average time between clicks: ${averageTimeBetweenClicks.toFixed(2)} ms`;
        }

        // Stop counting after {duration} seconds
        if (elapsedTime >= duration * 1000) {
            countingStarted = false;
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

        if ((event.key === 'a' || event.key === 'A') && canCountA) {
            aCount++;
            clickTimes.push(Date.now());
            canCountA = false;
            canCountD = true;
        } else if ((event.key === 'd' || event.key === 'D') && canCountD) {
            dCount++;
            clickTimes.push(Date.now());
            canCountD = false;
            canCountA = true;
        }

        if (falseKeys.includes(event.key)) {
            missClicks++;
        }
    });
});
