import fs from 'fs';
import path from 'path';

const V3_DIR = path.join(process.cwd(), 'data', 'interviews_v2');

if (!fs.existsSync(V3_DIR)) {
  fs.mkdirSync(V3_DIR, { recursive: true });
}

// Helper to create Viva
function generateMiniViva(projName: string) {
  return {
    projectName: projName,
    description: `A focused implementation demonstrating core algorithmic principles for ${projName}.`,
    businessUseCase: "Demonstrates problem-solving ability and optimization in critical application paths.",
    architectureDiagramDesc: "Algorithmic flow from input parsing -> core logic -> output generation.",
    techStack: ["Data Structures", "Algorithms", "Big O"],
    expectedFeatures: ["Optimal Time Complexity", "Optimal Space Complexity", "Edge Case Handling"],
    deploymentStrategy: "Executed in competitive programming or interview environments.",
    scalabilityDiscussion: "Scaling involves transitioning from O(n^2) to O(n log n) or O(n) solutions.",
    databaseDesign: "N/A - In-memory execution.",
    apiDesign: "Standard I/O or function signatures.",
    securityConsiderations: "Buffer overflows and input validation.",
    performanceOptimizations: "Memoization, Tabulation, Two-Pointers, Hashing.",
    testingStrategy: "Unit testing with boundary values and large datasets.",
    futureImprovements: "Parallel processing or transitioning to distributed algorithms.",
    questions: {
      basic: ["What is the time complexity?", "What is the space complexity?", "Explain your approach."],
      intermediate: ["Can this be solved faster?", "How do you handle negative inputs?", "Is this stable?"],
      advanced: ["How would this perform with 10GB of data?", "What if memory is strictly limited?", "Can we parallelize this?"],
      systemDesign: ["How would you expose this as a high-throughput API?", "Where would you cache results?"],
      optimization: ["Identify the bottleneck.", "Can we trade space for time here?"],
      deployment: [],
      security: [],
      database: [],
      architecture: [],
      behavioral: ["Did you consider other approaches?", "How did you get unstuck?"]
    }
  };
}

// -------------------------------------------------------------
// V6 Curated LeetCode Database (Representative Subset)
// -------------------------------------------------------------
const LC_DB = [
  // Basic Programming
  { id: "lc_1480", title: "Running Sum of 1d Array", difficulty: "Easy", topic: "Basic", url: "https://leetcode.com/problems/running-sum-of-1d-array/", companies: ["Amazon"] },
  { id: "lc_1672", title: "Richest Customer Wealth", difficulty: "Easy", topic: "Basic", url: "https://leetcode.com/problems/richest-customer-wealth/", companies: ["Apple"] },
  { id: "lc_412", title: "Fizz Buzz", difficulty: "Easy", topic: "Basic", url: "https://leetcode.com/problems/fizz-buzz/", companies: ["Microsoft"] },
  
  // Arrays & Strings
  { id: "lc_1", title: "Two Sum", difficulty: "Easy", topic: "Arrays", url: "https://leetcode.com/problems/two-sum/", companies: ["Google", "Amazon", "Meta"] },
  { id: "lc_121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Arrays", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", companies: ["Amazon", "Microsoft"] },
  { id: "lc_217", title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays", url: "https://leetcode.com/problems/contains-duplicate/", companies: ["Apple", "Uber"] },
  { id: "lc_238", title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays", url: "https://leetcode.com/problems/product-of-array-except-self/", companies: ["Amazon", "Meta"] },
  { id: "lc_53", title: "Maximum Subarray", difficulty: "Medium", topic: "Arrays", url: "https://leetcode.com/problems/maximum-subarray/", companies: ["Google", "Apple"] },
  { id: "lc_3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Strings", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", companies: ["Amazon", "Microsoft"] },
  { id: "lc_424", title: "Longest Repeating Character Replacement", difficulty: "Medium", topic: "Strings", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", companies: ["Google", "Meta"] },
  { id: "lc_76", title: "Minimum Window Substring", difficulty: "Hard", topic: "Strings", url: "https://leetcode.com/problems/minimum-window-substring/", companies: ["Meta", "Amazon", "LinkedIn"] },
  { id: "lc_242", title: "Valid Anagram", difficulty: "Easy", topic: "HashMaps", url: "https://leetcode.com/problems/valid-anagram/", companies: ["Amazon", "Google"] },
  { id: "lc_49", title: "Group Anagrams", difficulty: "Medium", topic: "HashMaps", url: "https://leetcode.com/problems/group-anagrams/", companies: ["Amazon", "Microsoft", "Meta"] },
  
  // Linked Lists, Stacks, Queues
  { id: "lc_206", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked Lists", url: "https://leetcode.com/problems/reverse-linked-list/", companies: ["Amazon", "Apple"] },
  { id: "lc_141", title: "Linked List Cycle", difficulty: "Easy", topic: "Linked Lists", url: "https://leetcode.com/problems/linked-list-cycle/", companies: ["Microsoft", "Bloomberg"] },
  { id: "lc_21", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", companies: ["Amazon", "Google"] },
  { id: "lc_143", title: "Reorder List", difficulty: "Medium", topic: "Linked Lists", url: "https://leetcode.com/problems/reorder-list/", companies: ["Meta", "Amazon"] },
  { id: "lc_20", title: "Valid Parentheses", difficulty: "Easy", topic: "Stacks", url: "https://leetcode.com/problems/valid-parentheses/", companies: ["Amazon", "Google", "Meta"] },
  { id: "lc_155", title: "Min Stack", difficulty: "Medium", topic: "Stacks", url: "https://leetcode.com/problems/min-stack/", companies: ["Amazon", "Bloomberg"] },
  { id: "lc_739", title: "Daily Temperatures", difficulty: "Medium", topic: "Stacks", url: "https://leetcode.com/problems/daily-temperatures/", companies: ["Google", "Microsoft"] },
  
  // Binary Search, Two Pointers, Sliding Window
  { id: "lc_704", title: "Binary Search", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/binary-search/", companies: ["Google", "Amazon"] },
  { id: "lc_74", title: "Search a 2D Matrix", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-a-2d-matrix/", companies: ["Amazon", "Microsoft"] },
  { id: "lc_167", title: "Two Sum II", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", companies: ["Amazon", "Apple"] },
  { id: "lc_15", title: "3Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", companies: ["Amazon", "Meta", "Google"] },
  { id: "lc_209", title: "Minimum Size Subarray Sum", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-size-subarray-sum/", companies: ["Goldman Sachs"] },

  // Trees & Heaps
  { id: "lc_104", title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Trees", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", companies: ["Amazon", "Microsoft"] },
  { id: "lc_226", title: "Invert Binary Tree", difficulty: "Easy", topic: "Trees", url: "https://leetcode.com/problems/invert-binary-tree/", companies: ["Google", "Meta"] },
  { id: "lc_102", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", companies: ["Amazon", "LinkedIn"] },
  { id: "lc_230", title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "Trees", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", companies: ["Amazon", "Meta"] },
  { id: "lc_297", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", companies: ["Google", "Meta", "Amazon"] },
  { id: "lc_347", title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heaps", url: "https://leetcode.com/problems/top-k-frequent-elements/", companies: ["Amazon", "Meta"] },
  { id: "lc_23", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heaps", url: "https://leetcode.com/problems/merge-k-sorted-lists/", companies: ["Google", "Amazon", "Microsoft"] },

  // Recursion, Backtracking & DP
  { id: "lc_39", title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/combination-sum/", companies: ["Amazon", "Meta"] },
  { id: "lc_46", title: "Permutations", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/permutations/", companies: ["Microsoft", "Google"] },
  { id: "lc_51", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", companies: ["Amazon", "Meta"] },
  { id: "lc_70", title: "Climbing Stairs", difficulty: "Easy", topic: "Dynamic Programming", url: "https://leetcode.com/problems/climbing-stairs/", companies: ["Amazon", "Google"] },
  { id: "lc_322", title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", url: "https://leetcode.com/problems/coin-change/", companies: ["Amazon", "Meta"] },
  { id: "lc_300", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "Dynamic Programming", url: "https://leetcode.com/problems/longest-increasing-subsequence/", companies: ["Google", "Microsoft"] },
  { id: "lc_1143", title: "Longest Common Subsequence", difficulty: "Medium", topic: "Dynamic Programming", url: "https://leetcode.com/problems/longest-common-subsequence/", companies: ["Amazon", "Google"] },

  // Graphs
  { id: "lc_200", title: "Number of Islands", difficulty: "Medium", topic: "Graphs", url: "https://leetcode.com/problems/number-of-islands/", companies: ["Amazon", "Google"] },
  { id: "lc_133", title: "Clone Graph", difficulty: "Medium", topic: "Graphs", url: "https://leetcode.com/problems/clone-graph/", companies: ["Meta", "Amazon"] },
  { id: "lc_207", title: "Course Schedule", difficulty: "Medium", topic: "Graphs", url: "https://leetcode.com/problems/course-schedule/", companies: ["Amazon", "Meta"] },
  { id: "lc_417", title: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "Graphs", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", companies: ["Google", "Amazon"] },
  { id: "lc_127", title: "Word Ladder", difficulty: "Hard", topic: "Graphs", url: "https://leetcode.com/problems/word-ladder/", companies: ["Amazon", "Meta", "LinkedIn"] },

  // Greedy & Shortest Path
  { id: "lc_55", title: "Jump Game", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game/", companies: ["Amazon", "Microsoft"] },
  { id: "lc_45", title: "Jump Game II", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game-ii/", companies: ["Amazon", "Google"] },
  { id: "lc_743", title: "Network Delay Time", difficulty: "Medium", topic: "Shortest Path", url: "https://leetcode.com/problems/network-delay-time/", companies: ["Google", "Amazon"] },
  { id: "lc_787", title: "Cheapest Flights Within K Stops", difficulty: "Medium", topic: "Shortest Path", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", companies: ["Amazon", "Google"] }
];

function getQuestions(topics: string[]) {
  return LC_DB.filter(q => topics.includes(q.topic));
}

const DSA_ROADMAP = {
  tracks: [
    {
      id: "beginner",
      title: "Beginner Track",
      description: "Foundations of Programming and basic Data Structures.",
      weeks: [
        {
          week: 1, title: "Programming Fundamentals", focus: ["Variables", "Loops", "Functions", "Complexity Basics"],
          targetCount: 20, projects: [{ name: "Calculator", viva: generateMiniViva("Calculator") }],
          questions: getQuestions(["Basic"]),
          mockQuiz: { title: "Fundamentals Quiz", questions: 10 }
        },
        {
          week: 2, title: "Arrays", focus: ["Traversal", "Searching", "Prefix Sum"],
          targetCount: 40, projects: [{ name: "Student Record System", viva: generateMiniViva("Student Record System") }, { name: "Array Analytics Tool", viva: generateMiniViva("Array Analytics Tool") }],
          questions: getQuestions(["Arrays"]),
          mockQuiz: { title: "Arrays Quiz", questions: 15 }
        },
        {
          week: 3, title: "Strings", focus: ["String Manipulation", "Hashing Basics"],
          targetCount: 40, projects: [{ name: "Text Analyzer", viva: generateMiniViva("Text Analyzer") }, { name: "Palindrome Checker", viva: generateMiniViva("Palindrome Checker") }],
          questions: getQuestions(["Strings"]),
          mockQuiz: { title: "Strings Quiz", questions: 15 }
        },
        {
          week: 4, title: "HashMaps & Sets", focus: ["Frequency Counting", "Duplicate Detection"],
          targetCount: 40, projects: [{ name: "Word Counter", viva: generateMiniViva("Word Counter") }, { name: "Duplicate Detection Tool", viva: generateMiniViva("Duplicate Detection Tool") }],
          questions: getQuestions(["HashMaps"]),
          mockQuiz: { title: "Hashing Quiz", questions: 15 }
        }
      ]
    },
    {
      id: "intermediate",
      title: "Intermediate Track",
      description: "Core Data Structures and foundational algorithms.",
      weeks: [
        {
          week: 5, title: "Linked Lists", focus: ["Traversal", "Reversal", "Cycle Detection"],
          targetCount: 40, projects: [{ name: "Custom Linked List Library", viva: generateMiniViva("Custom Linked List Library") }],
          questions: getQuestions(["Linked Lists"]),
          mockQuiz: { title: "Linked Lists Quiz", questions: 20 }
        },
        {
          week: 6, title: "Stacks & Queues", focus: ["LIFO/FIFO", "Monotonic Stacks"],
          targetCount: 40, projects: [{ name: "Expression Evaluator", viva: generateMiniViva("Expression Evaluator") }, { name: "Browser History Simulator", viva: generateMiniViva("Browser History Simulator") }],
          questions: getQuestions(["Stacks"]),
          mockQuiz: { title: "Stacks & Queues Quiz", questions: 20 }
        },
        {
          week: 7, title: "Binary Search & Two Pointers", focus: ["Search Optimization", "Sliding Window"],
          targetCount: 60, projects: [{ name: "Search Optimization Engine", viva: generateMiniViva("Search Optimization Engine") }],
          questions: getQuestions(["Binary Search", "Two Pointers", "Sliding Window"]),
          mockQuiz: { title: "Two Pointers Quiz", questions: 20 }
        },
        {
          week: 8, title: "Trees & BST", focus: ["Traversal", "Recursion", "BST Properties"],
          targetCount: 60, projects: [{ name: "File System Explorer", viva: generateMiniViva("File System Explorer") }],
          questions: getQuestions(["Trees"]),
          mockQuiz: { title: "Trees Quiz", questions: 25 }
        },
        {
          week: 9, title: "Heaps & Priority Queues", focus: ["Min/Max Heap", "Top K Elements"],
          targetCount: 40, projects: [{ name: "Task Scheduler", viva: generateMiniViva("Task Scheduler") }],
          questions: getQuestions(["Heaps"]),
          mockQuiz: { title: "Heaps Quiz", questions: 15 }
        },
        {
          week: 10, title: "Recursion & Backtracking", focus: ["Combinations", "Permutations", "Subsets"],
          targetCount: 50, projects: [{ name: "Sudoku Solver", viva: generateMiniViva("Sudoku Solver") }, { name: "N-Queens Solver", viva: generateMiniViva("N-Queens Solver") }],
          questions: getQuestions(["Backtracking"]),
          mockQuiz: { title: "Backtracking Quiz", questions: 20 }
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Track",
      description: "Complex Algorithms for top-tier product companies.",
      weeks: [
        {
          week: 11, title: "Graphs", focus: ["BFS", "DFS", "Topological Sort"],
          targetCount: 60, projects: [{ name: "Social Network Graph", viva: generateMiniViva("Social Network Graph") }, { name: "Route Planner", viva: generateMiniViva("Route Planner") }],
          questions: getQuestions(["Graphs"]),
          mockQuiz: { title: "Graphs Quiz", questions: 25 }
        },
        {
          week: 12, title: "Shortest Path Algorithms", focus: ["Dijkstra", "Bellman Ford", "Floyd Warshall"],
          targetCount: 40, projects: [{ name: "Navigation System", viva: generateMiniViva("Navigation System") }],
          questions: getQuestions(["Shortest Path"]),
          mockQuiz: { title: "Shortest Path Quiz", questions: 15 }
        },
        {
          week: 13, title: "Greedy Algorithms", focus: ["Local Optimums", "Interval Scheduling"],
          targetCount: 40, projects: [{ name: "Resource Allocation Simulator", viva: generateMiniViva("Resource Allocation Simulator") }],
          questions: getQuestions(["Greedy"]),
          mockQuiz: { title: "Greedy Quiz", questions: 20 }
        },
        {
          week: 14, title: "Dynamic Programming I", focus: ["1D DP", "Memoization", "Tabulation"],
          targetCount: 50, projects: [{ name: "Investment Planner", viva: generateMiniViva("Investment Planner") }],
          questions: getQuestions(["Dynamic Programming"]),
          mockQuiz: { title: "1D DP Quiz", questions: 25 }
        },
        {
          week: 15, title: "Dynamic Programming II", focus: ["2D DP", "Knapsack", "LIS"],
          targetCount: 50, projects: [{ name: "Optimization Engine", viva: generateMiniViva("Optimization Engine") }],
          questions: getQuestions(["Dynamic Programming"]),
          mockQuiz: { title: "2D DP Quiz", questions: 25 }
        }
      ]
    }
  ],
  companyTracks: [
    {
      id: "placement",
      title: "Placement Track (Service Based)",
      companies: ["TCS", "Infosys", "Wipro", "Accenture", "Capgemini", "Cognizant", "Deloitte", "PwC", "EY"],
      targetCount: 300,
      focus: ["Basic Arrays", "Strings", "SQL", "Aptitude", "Pattern Printing"]
    },
    {
      id: "product",
      title: "Product Company Track (FAANG)",
      companies: ["Google", "Amazon", "Microsoft", "Meta", "Adobe", "Uber", "Atlassian", "Salesforce", "Oracle", "NVIDIA"],
      targetCount: 500,
      focus: ["Advanced DSA", "System Design", "Dynamic Programming", "Graphs", "Concurrency"]
    }
  ]
};

// Write it to a global file, not inside a specific role.
fs.writeFileSync(path.join(V3_DIR, 'dsa_roadmap.json'), JSON.stringify(DSA_ROADMAP, null, 2));

console.log("Successfully generated the 15-Week DSA Roadmap structure!");
