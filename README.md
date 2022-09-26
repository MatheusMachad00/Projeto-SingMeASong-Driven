# Project Sing me a song


## Usage:

### -POST /recommendations
##### This route creates a new recommendation. You should send data in this format:
```
{
 name:  "Kodak Black - Super Gremlin",
 youtubeLink:  "https://www.youtube.com/watch?v=kiB9qk4gnt4"
}
```
### -POST /recommendations/:id/upvote
##### This route give an upvote to a recommendation based on its ID.

### -POST /recommendations/:id/downvote
##### This route give a downvte to a recommendation based on its ID.

### -GET /recommendations
##### This route will return the last ten recommendations.

### -GET /recommendations/:id
##### This route will return the recommendation based on its ID.

### -Get /recommendations/random
##### This route will return a random recommendation if it has 10 or more upvotes in 70% of the cases. In 30% of the cases this route will return a recommendation with -5 to 10 upvotes. If all recommendations has more than 10 upvotes or less than 10 upvotes this route will return 100% of the cases any recommendation.

### -GET /recommendation/top/:amout
##### This route will return the top X (X is the number received through amount parameter) recommendations with more upvotes.
