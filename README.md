# The Task
https://hackmd.io/@wLoE_eXuSuq7EoGoJOpgDw/r1PwyoI9v

# Features I've implemented
- User authentication, requiring BITS Mail. A welcome mail is sent when a new user is created.
- Each user has a profile which he/she can update.
- Users can add their items for sale. The items must have a description, base price and a category. An optional photo of the item can also be added.
- Every user has access to a common homepage, where all the unsold items are listed. The items can also be sorted by their price, date and their categories, by adding arguments as query strings.
- The seller can see all the bids made on his item, and has the choice of choosing the bid, which might not necessarily be the highest.
- After the seller accepts the bid, an email confirmation is sent to both the seller and the bidder with each other's email address for the communication to continue outside the app.
- Every user has access to `/mypurchases`, where they can see the items which they have purchased, and `/sold`, where they can see all their items which have been sold. All users also have access to `/myitems`, where the unsold items put on sale by the user are displayed.
- The admin can restrict a user from posting new items on sale, and can also delete a user's profile.
