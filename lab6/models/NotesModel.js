const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    noteTitle: {
        type: String,
        required: [true, 'Note title is required'],
        trim: true
    },
    noteDescription: {
        type: String,
        required: [true, 'Note description is required'],
        trim: true
    },
    priority: {
        type: String,
        required: true,
        enum: {
            values: ['HIGH', 'LOW', 'MEDIUM'],
            message: '{VALUE} is not a valid priority'
        },
        uppercase: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);