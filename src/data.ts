interface Book {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
}

const books: Book[] = [
    { id: 1, title: "Atomic Habits", price: 15.99, category: "Self-help", description: 'A guide to building good habits and breaking bad ones.' },
    { id: 2, title: "Do It Today", price: 13.99, category: "Motivational", description: 'Inspiration for overcoming procrastination and achieving more.' },
    { id: 3, title: "Psychology of Money", price: 17.99, category: "Finance", description: 'Exploring how our behavior affects our financial decisions.' },
    { id: 4, title: "Rich Dad Poor Dad", price: 12.99, category: "Finance", description: 'Lessons in financial literacy between two contrasting perspectives.' },
    { id: 5, title: "The Laws of Human Nature", price: 18.99, category: "Psychology", description: 'An examination of human behavior and its driving forces.' },
    { id: 6, title: "The Alchemist", price: 11.99, category: "Fiction", description: 'A mystical story about following your dreams and finding your destiny.' },
];

export default books;

// new book to add for testing
// title: "The Midnight Library",
// price: 16.99, 
// category: "Fiction", 
// description: 'A novel about the choices that go into a life well lived, exploring a magical library that houses books of alternate lives one could have lived.' }
