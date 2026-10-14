import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Palette,
  Sliders,
  Image as ImageIcon,
  Trash2,
  Check,
  Eye,
  RefreshCw,
  Layers,
  Crop,
  Maximize2,
} from 'lucide-react';
import { ImageDisplayConfig } from '../types';
import {
  getImageContainerStyles,
  getImageElementProps,
  getAspectRatioClass,
  getRadiusClass,
  getFilterStyle,
  getHoverClass,
} from '../utils/imageStyleHelper';

interface ImageDisplayCustomizerProps {
  target: 'product' | 'blog';
  imageUrl: string;
  config?: ImageDisplayConfig;
  onImageChange: (url: string) => void;
  onConfigChange: (config: ImageDisplayConfig) => void;
  title?: string;
}

// Preset images curated for high quality presentation
const SAMPLE_PRESETS: { [key: string]: { label: string; url: string; category: string }[] } = {
  product: [
    {
      label: 'Bìa Xanh Sâu Lắng (Tỉnh Thức)',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      category: 'Tỉnh Thức & Tư Duy',
    },
    {
      label: 'Bìa Nghệ Thuật Tối Giản',
      url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      category: 'Tỉnh Thức & Tư Duy',
    },
    {
      label: 'Bìa Vàng Hoàng Kim (Tài Chính)',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      category: 'Tài Chính & Dòng Tiền',
    },
    {
      label: 'Bìa Kiến Tạo Kết Nối',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      category: 'Giao Tiếp & Lãnh Đạo',
    },
    {
      label: 'Bìa Công Nghệ AI Đột Phá',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      category: 'Công Nghệ & Tương Lai',
    },
    {
      label: 'Bìa Phong Cách Sách Da Cổ Điển',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      category: 'Cổ Điển Sang Trọng',
    },
  ],
  blog: [
    {
      label: 'Bình Minh Tĩnh Lặng & Cà Phê',
      url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80',
      category: 'Lối Sống & Buổi Sáng',
    },
    {
      label: 'Không Gian Làm Việc Tập Trung Sâu',
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
      category: 'Năng Suất & Deep Work',
    },
    {
      label: 'Cuộc Đối Thoại Thấu Cảm',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
      category: 'Giao Tiếp & Con Người',
    },
    {
      label: 'Biểu Đồ Tài Chính & Tăng Trưởng',
      url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80',
      category: 'Tài Chính & Kỷ Luật',
    },
    {
      label: 'Tâm Trí Bình An Bên Thiên Nhiên',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      category: 'Tỉnh Thức & Cảm Xúc',
    },
    {
      label: 'Sáng Tạo Ý Tưởng & Đổi Mới',
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
      category: 'Tư Duy & Chiến Lược',
    },
  ],
};

const DEFAULT_CONFIG: ImageDisplayConfig = {
  aspectRatio: '3/4',
  objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: 'xl',
  filterPreset: 'normal',
  hoverEffect: 'zoom',
  overlayOpacity: 0,
  showBorder: true,
};

export const ImageDisplayCustomizer: React.FC<ImageDisplayCustomizerProps> = ({
  target,
  imageUrl,
  config = DEFAULT_CONFIG,
  onImageChange,
  onConfigChange,
  title,
}) => {
  const [sourceTab, setSourceTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [inputUrl, setInputUrl] = useState(imageUrl || '');
  const [urlError, setUrlError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Merge with defaults
  const currentConfig: ImageDisplayConfig = {
    aspectRatio: config.aspectRatio || (target === 'product' ? '3/4' : '16/9'),
    heightMode: config.heightMode || 'aspect',
    customHeight: config.customHeight || (target === 'product' ? 260 : 200),
    objectFit: config.objectFit || 'cover',
    objectPosition: config.objectPosition || 'center',
    borderRadius: config.borderRadius || 'xl',
    filterPreset: config.filterPreset || 'normal',
    hoverEffect: config.hoverEffect || 'zoom',
    overlayOpacity: config.overlayOpacity ?? 0,
    showBorder: config.showBorder ?? true,
  };

  const updateConfig = (patch: Partial<ImageDisplayConfig>) => {
    onConfigChange({ ...currentConfig, ...patch });
  };

  // Handle File Input Upload
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh (PNG, JPG, WEBP, SVG).');
      return;
    }
    // Limit to 10MB file
    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước ảnh quá lớn (vui lòng chọn ảnh dưới 10MB).');
      return;
    }

    setUploadFileName(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onImageChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    setUrlError('');
    if (!inputUrl.trim()) {
      setUrlError('Vui lòng nhập đường dẫn URL ảnh.');
      return;
    }
    onImageChange(inputUrl.trim());
    setUploadFileName(null);
  };

  const handleRemoveImage = () => {
    onImageChange('');
    setInputUrl('');
    setUploadFileName(null);
  };

  // Shared container styles matching user-facing UI 100%
  const previewContainer = getImageContainerStyles(currentConfig, target);
  const previewImgProps = getImageElementProps(currentConfig);

  return (
    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {title || (target === 'product' ? 'Hình Ảnh Bìa Ấn Phẩm Ebook' : 'Hình Ảnh Thumbnail Bài Viết')}
            </h4>
            <p className="text-[11px] text-slate-500">
              Thêm ảnh tùy ý &amp; tinh chỉnh tỉ lệ, góc bo, màu sắc, hiệu ứng hiển thị trực quan
            </p>
          </div>
        </div>

        {imageUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa ảnh</span>
          </button>
        )}
      </div>

      {/* Main Grid: Input Sources + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Image Source Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Source Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSourceTab('upload')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                sourceTab === 'upload' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tải file từ máy</span>
            </button>

            <button
              type="button"
              onClick={() => setSourceTab('url')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                sourceTab === 'url' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Nhập Link ảnh</span>
            </button>

            <button
              type="button"
              onClick={() => setSourceTab('presets')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                sourceTab === 'presets' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Thư viện mẫu</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD */}
          {sourceTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
                  : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Nhấp để duyệt ảnh hoặc kéo thả tệp vào đây
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hỗ trợ PNG, JPG, WEBP, SVG (khuyên dùng ảnh có độ phân giải tối thiểu 800px)
              </p>
              {uploadFileName && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>{uploadFileName}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LINK URL */}
          {sourceTab === 'url' && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Đường dẫn hình ảnh trực tuyến (Image URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg hoặc link Unsplash"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Áp dụng
                </button>
              </div>
              {urlError && <p className="text-[11px] text-rose-600">{urlError}</p>}
              <p className="text-[11px] text-slate-400">
                Bạn có thể copy link từ Unsplash, Pexels, Google Drive (direct link) hoặc máy chủ CDN.
              </p>
            </div>
          )}

          {/* TAB 3: CURATED PRESETS */}
          {sourceTab === 'presets' && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Chọn nhanh từ thư viện ảnh tuyển chọn chất lượng cao:</span>
                <span className="text-[10px] text-blue-600 font-semibold">1-Click áp dụng</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {SAMPLE_PRESETS[target]?.map((preset, index) => {
                  const isSelected = imageUrl === preset.url;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        onImageChange(preset.url);
                        setInputUrl(preset.url);
                        setUploadFileName(null);
                      }}
                      className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                          : 'border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-1.5 bg-white">
                        <p className="text-[10px] font-bold text-slate-800 truncate">{preset.label}</p>
                        <p className="text-[9px] text-slate-400 truncate">{preset.category}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CẤU HÌNH TINH CHỈNH ẢNH HIỂN THỊ (TUNING CONTROLS) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowConfigPanel(!showConfigPanel)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-blue-700">
                <Sliders className="w-4 h-4" />
                <span>Cấu Hình Tinh Chỉnh Ảnh Hiển Thị (Display Tuning)</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {showConfigPanel ? 'Thu gọn ▲' : 'Mở rộng ▼'}
              </span>
            </button>

            {showConfigPanel && (
              <div className="p-4 space-y-4 text-xs">
                {/* 1. Tỷ lệ khung hình (Aspect Ratio) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>1. Tỷ lệ khung hình (Aspect Ratio)</span>
                    <span className="font-mono text-blue-600 font-semibold">{currentConfig.aspectRatio}</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {[
                      { id: '3/4', label: '3:4 (Ebook)', desc: 'Bìa sách chuẩn' },
                      { id: '2/3', label: '2:3 (Dọc)', desc: 'Tiểu thuyết' },
                      { id: '1/1', label: '1:1 (Vuông)', desc: 'Instagram' },
                      { id: '4/3', label: '4:3 (Tiêu chuẩn)', desc: 'Bài viết báo' },
                      { id: '16/9', label: '16:9 (Ngang)', desc: 'Điện ảnh Hero' },
                      { id: 'auto', label: 'Tự do', desc: 'Ảnh gốc' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => updateConfig({ aspectRatio: item.id as any })}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          currentConfig.aspectRatio === item.id
                            ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-[11px]">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Kích thước & Chiều cao hiển thị (Dimensions & Height Sizing) */}
                <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>2. Chế độ kích thước &amp; Chiều cao (Height)</span>
                    </label>
                    <span className="font-mono text-[11px] text-blue-700 font-bold">
                      {currentConfig.heightMode === 'fixed'
                        ? `${currentConfig.customHeight || 260}px (Cố định)`
                        : `Tự động theo tỷ lệ (${currentConfig.aspectRatio})`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateConfig({ heightMode: 'aspect' })}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        currentConfig.heightMode !== 'fixed'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Co giãn theo tỷ lệ (Khuyên dùng)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig({
                          heightMode: 'fixed',
                          customHeight: currentConfig.customHeight || (target === 'product' ? 260 : 200),
                        })
                      }
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        currentConfig.heightMode === 'fixed'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Cố định chiều cao (px)
                    </button>
                  </div>

                  {currentConfig.heightMode === 'fixed' && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Kéo chỉnh chiều cao:</span>
                        <span className="font-mono font-bold text-blue-700">
                          {currentConfig.customHeight || 260}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="160"
                        max="450"
                        step="10"
                        value={currentConfig.customHeight || (target === 'product' ? 260 : 200)}
                        onChange={(e) => updateConfig({ customHeight: Number(e.target.value) })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">Gợi ý nhanh:</span>
                        {[200, 260, 320, 380].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => updateConfig({ customHeight: h, heightMode: 'fixed' })}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                              currentConfig.customHeight === h
                                ? 'bg-blue-100 border-blue-400 text-blue-800 font-bold'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {h}px
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Chế độ vừa khung (Object Fit) & Vị trí tâm ảnh (Object Position) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">2. Chế độ vừa khung (Fit)</label>
                    <select
                      value={currentConfig.objectFit}
                      onChange={(e) => updateConfig({ objectFit: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="cover">Cover (Cắt vừa khít khung - Đẹp nhất)</option>
                      <option value="contain">Contain (Hiển thị trọn vẹn, không cắt)</option>
                      <option value="scale-down">Scale-down (Thu nhỏ tỉ lệ)</option>
                      <option value="fill">Fill (Kéo dãn lấp đầy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">3. Trọng tâm ảnh (Position)</label>
                    <select
                      value={currentConfig.objectPosition}
                      onChange={(e) => updateConfig({ objectPosition: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="center">Trung tâm (Center)</option>
                      <option value="top">Phía trên (Top - Giữ đầu bìa)</option>
                      <option value="bottom">Phía dưới (Bottom)</option>
                      <option value="left">Căn trái (Left)</option>
                      <option value="right">Căn phải (Right)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Bo góc (Border Radius) & Viền (Border) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">4. Bo góc khung ảnh</label>
                    <select
                      value={currentConfig.borderRadius}
                      onChange={(e) => updateConfig({ borderRadius: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="none">Sắc nét vuông vức (none)</option>
                      <option value="sm">Bo góc nhẹ (sm - 6px)</option>
                      <option value="md">Bo vừa phải (md - 8px)</option>
                      <option value="lg">Bo tròn vừa (lg - 12px)</option>
                      <option value="xl">Bo phong cách hiện đại (xl - 16px)</option>
                      <option value="2xl">Bo tròn lớn (2xl - 24px)</option>
                      <option value="full">Tròn hoàn toàn (Pill/Circle)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">5. Viền sang trọng &amp; Đổ bóng</label>
                    <div className="flex items-center gap-3 pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                        <input
                          type="checkbox"
                          checked={currentConfig.showBorder ?? true}
                          onChange={(e) => updateConfig({ showBorder: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span>Bật viền tinh tế (Subtle Border)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 6. Bộ lọc màu (Filter Preset) & Hiệu ứng di chuột (Hover Effect) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">6. Bộ lọc màu sắc (Color Tone)</label>
                    <select
                      value={currentConfig.filterPreset}
                      onChange={(e) => updateConfig({ filterPreset: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      <option value="normal">Tự nhiên / Chuẩn gốc (Normal)</option>
                      <option value="cinematic">Cinematic (Tương phản điện ảnh)</option>
                      <option value="vibrant">Vibrant (Rực rỡ, sống động)</option>
                      <option value="warm">Warm (Tone ấm, tri thức)</option>
                      <option value="cool">Cool (Tone lạnh, công nghệ)</option>
                      <option value="vintage">Vintage (Hoài niệm cổ điển)</option>
                      <option value="grayscale">Monochrome (Đen trắng nghệ thuật)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">7. Hiệu ứng khi rê chuột (Hover)</label>
                    <select
                      value={currentConfig.hoverEffect}
                      onChange={(e) => updateConfig({ hoverEffect: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      <option value="zoom">Phóng to nhẹ (Smooth Zoom)</option>
                      <option value="glow">Phát sáng viền xanh (Glow Accent)</option>
                      <option value="lift">Nâng nổi 3D (Floating Lift)</option>
                      <option value="brightness">Tăng độ sáng (Brightness)</option>
                      <option value="none">Giữ tĩnh (Không hiệu ứng)</option>
                    </select>
                  </div>
                </div>

                {/* 8. Độ mờ lớp phủ tối (Overlay Opacity) */}
                <div>
                  <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                    <span>8. Lớp phủ làm dịu / tạo chiều sâu (Dark Overlay)</span>
                    <span className="font-mono text-blue-600 font-bold">{currentConfig.overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={currentConfig.overlayOpacity || 0}
                    onChange={(e) => updateConfig({ overlayOpacity: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0% (Trong suốt)</span>
                    <span>40% (Vừa vặn đọc chữ)</span>
                    <span>80% (Đậm nét)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Xem trước trực tiếp (Live Preview)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {currentConfig.aspectRatio} · {currentConfig.objectFit}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-100/60 rounded-xl min-h-[260px]">
            {imageUrl ? (
              <div className="w-full max-w-[260px] group cursor-pointer">
                {/* Simulated Container with Customized Settings - 100% Exact match to User View */}
                <div
                  style={previewContainer.style}
                  className={`${previewContainer.combinedClassName} shadow-md`}
                >
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={previewImgProps.style}
                    className={previewImgProps.className}
                  />

                  {/* Optional Dark / Vignette Overlay */}
                  {currentConfig.overlayOpacity && currentConfig.overlayOpacity > 0 ? (
                    <div
                      className="absolute inset-0 bg-slate-950 transition-opacity pointer-events-none"
                      style={{ opacity: currentConfig.overlayOpacity / 100 }}
                    />
                  ) : null}

                  {/* Book spine simulation if product */}
                  {target === 'product' && (
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none z-10" />
                  )}

                  {/* Sample Badge on top */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-600/90 text-white shadow-xs backdrop-blur-xs">
                      {target === 'product' ? 'BÌA EBOOK' : 'THUMBNAIL'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Khách hàng nhìn thấy đúng 100% kích thước &amp; hiệu ứng như khung này</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Rê chuột vào khung ảnh để kiểm tra hiệu ứng tương tác
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-200/80 text-slate-400 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-600">Chưa có ảnh được chọn</p>
                <p className="text-[11px] text-slate-400 max-w-[200px]">
                  Tải ảnh từ máy hoặc chọn ảnh trong Thư viện mẫu để xem trước
                </p>
              </div>
            )}
          </div>

          {/* Quick Info Summary */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <div>
              <span className="text-slate-400">Tỷ lệ:</span>{' '}
              <strong className="text-slate-800">{currentConfig.aspectRatio}</strong>
            </div>
            <div>
              <span className="text-slate-400">Chiều cao:</span>{' '}
              <strong className="text-slate-800">
                {currentConfig.heightMode === 'fixed'
                  ? `${currentConfig.customHeight || 260}px`
                  : 'Tự động co giãn'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400">Chế độ vừa:</span>{' '}
              <strong className="text-slate-800">{currentConfig.objectFit}</strong>
            </div>
            <div>
              <span className="text-slate-400">Tone màu:</span>{' '}
              <strong className="text-slate-800">{currentConfig.filterPreset}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
