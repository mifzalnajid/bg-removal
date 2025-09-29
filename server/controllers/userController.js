
import { Webhook } from "svix"
import userModel from "../models/userModel.js"

// Api Controller Function to Manage Clerk User with Database
// http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req, res) => {

    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        // Svix expects the raw body, not the parsed JSON
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

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
                await userModel.create(userData);
                res.json({ success: true });
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
                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                res.json({ success: true });
                break;
            }
            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id });
                res.json({ success: true });
                break;
            }
            default:
                res.json({ success: false, message: "Unknown event type" });
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}
export { clerkWebhooks }