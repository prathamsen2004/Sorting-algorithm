const n = 50;
const arr = [];

init();

let audioCtx = null;
// let sp = 0;
// async function takeSpeed() {
//   let speed = document.getElementById("customRange2");
//   console.log(speed.value);
//   sp=speed.
// }

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);

  // below two lines for volume control
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);

  osc.connect(node);
  node.connect(audioCtx.destination);
}

function init() {
  for (let i = 0; i < n; i++) {
    arr[i] = Math.random();
  }
  showBar();
}

function playbubble() {
  let copy = [...arr];
  let moves = bubbleSort(copy);
  animateBars(moves);
}

function playslc() {
  let copy = [...arr];
  let moves = selectionSort(copy);
  animateBars(moves);
}

function playmrg() {
  let copy = [...arr];
  const mov = [];
  let moves = mergeSorts(copy, 0, copy.length - 1, mov);
  animateBars(moves);
}

function animateBars(moves) {
  if (moves.length == 0) {
    showBar();
    return;
  }
  // shift give us 0th index of moves matrix
  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type == "swaps") {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (move.type == "inc") {
    arr[i] = arr[j];
  }

  playNote(200 + arr[i] * 500);
  // playNote(200+arr[j]*500);

  showBar(move);
  setTimeout(function () {
    animateBars(moves);
  }, 15);
}

// bubblesort
function bubbleSort(arr) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < arr.length; i++) {
      moves.push({ indices: [i - 1, i], type: "move" });
      if (arr[i - 1] > arr[i]) {
        swapped = true;
        moves.push({ indices: [i - 1, i], type: "swaps" });
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      }
    }
  } while (swapped);
  return moves;
}

// selection sort

function selectionSort(arr) {
  var i, j, min_idx;
  const moves = [];

  // One by one move boundary of unsorted subarray
  for (i = 0; i < n - 1; i++) {
    // Find the minimum element in unsorted array
    min_idx = i;
    for (j = i + 1; j < n; j++) {
      moves.push({ indices: [i, j], type: "move" });
      if (arr[j] < arr[min_idx]) min_idx = j;
    }

    // Swap the found minimum element with the first element
    moves.push({ indices: [min_idx, i], type: "swaps" });
    [arr[min_idx], arr[i]] = [arr[i], arr[min_idx]];
  }
  return moves;
}

// function merge(arr, l, m, r,moves)
// {
//     var n1 = m - l + 1;
//     var n2 = r - m;

//     // Create temp arrays
//     var L = new Array(n1);
//     var R = new Array(n2);

//     // Copy data to temp arrays L[] and R[]
//     for (var i = 0; i < n1; i++)
//         L[i] = arr[l + i];
//     for (var j = 0; j < n2; j++)
//         R[j] = arr[m + 1 + j];

//     // Merge the temp arrays back into arr[l..r]

//     // Initial index of first subarray
//     var i = 0;

//     // Initial index of second subarray
//     var j = 0;

//     // Initial index of merged subarray
//     var k = l;

//     while (i < n1 && j < n2) {
//         if (L[i] <= R[j]) {
//             arr[k] = L[i];
//             moves.push({indices:[k,i],type:"inc"});
//             i++;
//         }
//         else {
//             arr[k] = R[j];
//             moves.push({indices:[k,j],type:"inc"});
//             j++;
//         }
//         k++;
//     }

//     // Copy the remaining elements of
//     // L[], if there are any
//     while (i < n1) {
//         arr[k] = L[i];
//         moves.push({indices:[k,i],type:"inc"});
//         i++;
//         k++;
//     }

//     // Copy the remaining elements of
//     // R[], if there are any
//     while (j < n2) {
//         arr[k] = R[j];
//         moves.push({indices:[k,j],type:"inc"});
//         j++;
//         k++;
//     }
// }

function showBar(move) {
  container.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    // create bar
    const bar = document.createElement("div");
    bar.style.height = arr[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.type == "inc" && move.indices.includes(i)) {
      bar.style.backgroundColor = "red";
    } else if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swaps" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}
