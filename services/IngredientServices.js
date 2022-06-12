import { db } from "../configs/firebase";
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";

export default {
    /**
     * this function will be fired when you first time run the app,
     * and it will fetch first 5 posts, here I retrieve them in descending order, until the last added post appears first.
     */
    ingredientsFirstBatch: async function () {
        try {
            const first = query(collection(db, "ingredients"), orderBy("name"), limit(4));
            const documentSnapshots = await getDocs(first);

            let ingredients = [];
            let lastKey = "";

            documentSnapshots.forEach((doc) => {
                ingredients.push({
                    id: doc.id,
                    calories: doc.data().calories,
                    carbohydrate: doc.data().carbohydrate,
                    fat: doc.data().fat,
                    fiber: doc.data().fiber,
                    name: doc.data().name,
                    protein: doc.data().protein,
                    size: doc.data().size,
                    sugars: doc.data().sugars
                });
                lastKey = doc.data().name;
            });
            console.log(lastKey)
            return { ingredients: ingredients, lastKey };
        } catch (e) {
            console.log(e);
        }
    },

    /**
     * this function will be fired each time the user click on 'More Posts' button,
     * it receive key of last post in previous batch, then fetch next 5 posts
     * starting after last fetched post.  
     */
    ingredientsNextBatch: async (key) => {
        try {
            const next = query(collection(db, "ingredients"), orderBy("name"), startAfter(key), limit(4));
            const documentSnapshots = await getDocs(next);


            let ingredients = [];
            let lastKey = "";

            documentSnapshots.forEach((doc) => {
                ingredients.push({
                    id: doc.id,
                    calories: doc.data().calories,
                    carbohydrate: doc.data().carbohydrate,
                    fat: doc.data().fat,
                    fiber: doc.data().fiber,
                    name: doc.data().name,
                    protein: doc.data().protein,
                    size: doc.data().size,
                    sugars: doc.data().sugars
                });
                lastKey = doc.data().name;
            });
            return { ingredients: ingredients, lastKey };
        } catch (e) {
            console.log(e);
        }
    }
};