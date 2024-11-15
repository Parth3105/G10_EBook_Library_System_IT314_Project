// Utils/googleDrive.js
const { google } = require('googleapis');
const fs = require('fs');
const oauth2Client = require('../config/googleOAuth');
const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Function to upload a file to Google Drive
const uploadFileToDrive = async (filePath, fileName) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'application/pdf',
                parents: ["16vUcwtS6Z73TPKICZBpw4oVakjeOYTc8"],
            },
            media: {
                mimeType: 'application/pdf',
                body: fs.createReadStream(filePath),
            },
        });
        return response.data.id; // Return the file ID from Google Drive
    } catch (error) {
        console.error("Error uploading file to Google Drive:", error);
        throw error;
    }
};

// Function to set view-only permission on a file in Google Drive
const setViewOnlyPermission = async (fileId) => {
    try {
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone', // Allows anyone with the link to view
            },
        });

        await drive.files.update({
            fileId: fileId,
            requestBody: {
                copyRequiresWriterPermission: true, // Prevents copying
                viewersCanCopyContent: false,       // Prevents viewers from copying content
                writersCanShare: false,
                shortcutDetails: { targetMimeType: 'application/vnd.google-apps.shortcut' },  // Prevents sharing by others
            },
        });
    } catch (error) {
        console.error("Error setting view-only permission:", error);
    }
};

module.exports = { uploadFileToDrive, setViewOnlyPermission };
