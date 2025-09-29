
import { Webhook } from "svix"
import userModel from "../models/userModel.js"

// Api Controller Function to Manage Clerk User with Database
// http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req, res) => {

    // Safe logging for debugging
    console.log('Webhook endpoint hit. Headers:', req.headers);
    console.log('Webhook endpoint hit. Body:', req.body);
    try {
        // Enable Svix verification only in production
        if (process.env.NODE_ENV === 'production') {
            const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
            await whook.verify(JSON.stringify(req.body), {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            });
        } else {
            console.log('Skipping Svix verification in non-production environment');
        }

        const { data, type } = req.body;
        switch (type) {
            // ----------------------------To create----------------------------------
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                console.log('Attempting to create user:', userData);
                await userModel.create(userData);
                res.json({});
                break;
            }
            // --------------------For Update-----------------------------
            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                console.log('Attempting to update user:', userData);
                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                res.json({});
                break;
            }
            case "user.deleted": {
                console.log('Attempting to delete user with clerkId:', data.id);
                await userModel.findOneAndDelete({ clerkId: data.id });
                res.json({});
                break;
            }
            default:
                console.log('Unknown event type received:', type);
                break;
        }
    } catch (error) {
        console.log('Webhook handler error:', error.message);
        res.json({ success: false, message: error.message });
    }

}
export { clerkWebhooks }