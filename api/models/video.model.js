import mongoose from "mongoose";
const { Schema } = mongoose;

const videoSchema = new Schema({
  videoIndex: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  videoId: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    required: true,
    trim: true
  },
  channelId: {
    type: String,
    required: true,
    trim: true
  },
  channelTitle: {
    type: String,
    required: true,
    trim: true
  },
  statistics: {
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    engagementRate: {
      type: Number,
      default: 0
    }
  },
  publishedAt: {
    type: Date,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret.videoIndex;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret.videoIndex;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

videoSchema.pre('save', function(next) {
  if (this.statistics) {
    this.statistics.viewCount = Number(this.statistics.viewCount) || 0;
    this.statistics.likeCount = Number(this.statistics.likeCount) || 0;
    this.statistics.commentCount = Number(this.statistics.commentCount) || 0;
    this.statistics.engagementRate = Number(this.statistics.engagementRate) || 0;
  }
  next();
});

export const Video = mongoose.model("Video", videoSchema); 