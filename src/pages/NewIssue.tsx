import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle, Upload, Download, X, CheckCircle2, FileSpreadsheet, Save } from 'lucide-react';
import { PRODUCTS, CATEGORIES, COUNTRIES, TEAM_MEMBERS, PRIORITY_COLORS, SOURCE_COLORS, ISSUE_TYPE_COLORS, type IssueType } from '@/data';
import { useBrandStore } from '@/store/brandStore';

/* ── CSV 模板列定义 ── */
const TEMPLATE_HEADERS = ['标题','品牌','产品','问题分类','来源','国家','优先级','平台','预期完成时间','负责人','描述','标签'];
const TEMPLATE_EXAMPLE = ['酒壶机配网失败-iOS批量反馈','VIRTAVO','酒壶机2K','配网失败','APP工单','US','高','iOS','2026-06-15','李杰','大量用户反馈2.4G环境配网失败','固件,iOS,批量'];

/* ── 下载 CSV 模板 ── */
function downloadTemplate() {
  const rows = [TEMPLATE_HEADERS, TEMPLATE_EXAMPLE];
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = '售后问题导入模板.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── 解析 CSV 字符串 ── */
function parseCsv(text: string): Record<string, string>[] {
  const lines  = text.replace(/\r/g, '').split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  return lines.slice(1).map(line => {
    const vals: string[] = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    vals.push(cur.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return obj;
  });
}

/* ── 导入面板 ── */
function ImportPanel({ onClose }: { onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows]     = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [done, setDone]     = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      if (file.name.endsWith('.csv')) {
        setRows(parseCsv(text));
      } else {
        // XLSX: 提示用另存为CSV
        alert('请在Excel中选择「另存为 CSV」后再导入，或直接使用下方提供的 CSV 模板。');
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => { setImporting(false); setDone(true); }, 1200);
  };

  if (done) {
    return (
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 20px rgba(0,0,0,0.08)', marginBottom: 16, textAlign: 'center' }}>
        <CheckCircle2 size={40} color="#22c55e" style={{ marginBottom: 12 }} />
        <div style={{ fontWeight: 700, fontSize: 15, color: '#1a2035', marginBottom: 6 }}>成功导入 {rows.length} 条问题</div>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>问题已添加至列表，负责人将收到通知。</p>
        <button onClick={onClose} style={{ background: '#4FA7A0', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>完成</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 20px rgba(0,0,0,0.08)', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileSpreadsheet size={18} color="#4FA7A0" />
          <span style={{ fontWeight: 700, fontSize: 14, color: '#1a2035' }}>批量导入工单</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={downloadTemplate} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4FA7A010', color: '#4FA7A0', border: '1px solid #4FA7A030', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Download size={13} />下载 CSV 模板
          </button>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '6px 10px', cursor: 'pointer' }}><X size={14} color="#94a3b8" /></button>
        </div>
      </div>

      {/* Drop zone */}
      {rows.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          style={{ border: '2px dashed #e2e8f0', borderRadius: 14, padding: '32px 0', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#4FA7A0'; (e.currentTarget as HTMLElement).style.background = '#4FA7A008'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.background = ''; }}
        >
          <Upload size={28} color="#94a3b8" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>拖拽文件到此处，或点击选择</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>支持 .csv 格式（Excel 可另存为 CSV）</div>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {/* Preview table */}
      {rows.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              📄 <b>{fileName}</b> · 解析到 <b style={{ color: '#4FA7A0' }}>{rows.length}</b> 条记录
            </div>
            <button onClick={() => { setRows([]); setFileName(''); }} style={{ fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>重新上传</button>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: 12, marginBottom: 14 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', position: 'sticky', top: 0 }}>
                  {TEMPLATE_HEADERS.map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 50).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    {TEMPLATE_HEADERS.map(h => (
                      <td key={h} style={{ padding: '7px 10px', color: '#1a2035', whiteSpace: 'nowrap', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row[h] || '—'}</td>
                    ))}
                  </tr>
                ))}
                {rows.length > 50 && (
                  <tr><td colSpan={TEMPLATE_HEADERS.length} style={{ padding: '8px 10px', textAlign: 'center', color: '#94a3b8', fontSize: 11 }}>… 还有 {rows.length - 50} 条（预览仅显示前50）</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <button onClick={handleImport} disabled={importing} style={{ width: '100%', background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: importing ? 'wait' : 'pointer', opacity: importing ? 0.7 : 1 }}>
            {importing ? '正在导入...' : `✓ 确认导入 ${rows.length} 条问题`}
          </button>
        </>
      )}

      {/* Tips */}
      <div style={{ marginTop: 12, background: '#f8fafc', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#64748b' }}>
        <b style={{ color: '#4FA7A0' }}>💡 导入说明：</b>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, lineHeight: 1.8 }}>
          <li>必填列：标题、品牌（VIRTAVO/ShowMo）、产品、预期完成时间</li>
          <li>品牌必须为 <code>VIRTAVO</code> 或 <code>ShowMo</code>，优先级填 高/中/低</li>
          <li>平台填 <code>iOS</code> / <code>Android</code> / <code>双平台</code></li>
          <li>导入后问题会自动分配到对应品牌，并通知负责人</li>
        </ul>
      </div>
    </div>
  );
}

/* ══ 主页面 ══ */
export default function NewIssue() {
  const nav = useNavigate();
  const { activeBrand } = useBrandStore();
  const [showImport, setShowImport] = useState(false);
  const [brand, setBrand] = useState<'VIRTAVO'|'ShowMo'>(activeBrand);
  const [issueType, setIssueType] = useState<IssueType>('软件');
  const [f, setF] = useState({ title:'', product:'', category:'', country:'', source:'APP工单', priority:'中', owner:'李铧燕', expectedDate:'', description:'', tags:'', deviceSN:'', appAccount:'' });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  // 附件上传
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [videos, setVideos] = useState<{ name: string; size: string }[]>([]);

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5 - images.length);
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setImages(p => [...p, { name: f.name, url: e.target?.result as string }]);
      reader.readAsDataURL(f);
    });
  };
  const handleVideo = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    const mb = (f.size / 1024 / 1024).toFixed(1);
    setVideos([{ name: f.name, size: `${mb} MB` }]);
  };

  const Inp = ({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#1a2035', marginBottom: 6 }}>
        {label}{req && <span style={{ color: '#FF6B6B' }}>*</span>}
      </label>
      {children}
    </div>
  );
  const inp = { padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#F8FAFC', color: '#1a2035', width: '100%', boxSizing: 'border-box' as const };
  const sel = { ...inp, appearance: 'none' as const };

  return (
    <div>
      {/* Top header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav(-1)} style={{ background: '#fff', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={16} color="#64748b" />
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2035', margin: 0 }}>新建问题</h1>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, margin: 0 }}>提出者填写问题信息、优先级及预期完成时间</p>
          </div>
        </div>
        {/* Import button */}
        <button
          onClick={() => setShowImport(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: showImport ? '#4FA7A0' : '#fff', color: showImport ? '#fff' : '#4FA7A0', border: '1.5px solid #4FA7A040', borderRadius: 12, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 10px rgba(79,167,160,0.12)' }}
        >
          <Upload size={15} />
          批量导入工单
        </button>
      </div>

      {/* Import panel */}
      {showImport && <ImportPanel onClose={() => setShowImport(false)} />}

      {/* Divider */}
      {showImport && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 12, color: '#94a3b8' }}>或手动填写单条问题</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>
      )}

      {/* Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a2035', marginBottom: 16 }}>📋 基本信息</div>
            <Inp label="问题标题" req>
              <input value={f.title} onChange={e => set('title', e.target.value)} placeholder="简明描述问题，例：酒壶机配网失败-iOS大量反馈" style={inp} />
            </Inp>
            <Inp label="品牌" req>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['VIRTAVO', 'ShowMo'] as const).map(b => (
                  <button key={b} onClick={() => setBrand(b)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: brand === b ? '2px solid transparent' : '2px solid #e2e8f0', background: brand === b ? (b === 'VIRTAVO' ? '#4FA7A0' : '#c8dc00') : '#F8FAFC', color: brand === b ? (b === 'ShowMo' ? '#3d5200' : '#fff') : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{b}</button>
                ))}
              </div>
            </Inp>
            <Inp label="问题类型" req>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['软件', '硬件', '服务器'] as IssueType[]).map(t => {
                  const tc = ISSUE_TYPE_COLORS[t];
                  return (
                    <button key={t} onClick={() => setIssueType(t)} style={{ flex: 1, padding: '9px 0', borderRadius: 12, border: issueType === t ? `2px solid ${tc.color}50` : '2px solid transparent', background: issueType === t ? tc.bg : '#F8FAFC', color: issueType === t ? tc.color : '#A0AEC0', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{t}问题</button>
                  );
                })}
              </div>
            </Inp>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Inp label="产品" req>
                <select value={f.product} onChange={e => set('product', e.target.value)} style={sel}><option value="">选择产品...</option>{PRODUCTS[brand].map(p => <option key={p}>{p}</option>)}</select>
              </Inp>
              <Inp label="问题分类" req>
                <select value={f.category} onChange={e => set('category', e.target.value)} style={sel}><option value="">选择分类...</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
              </Inp>
            </div>
            <Inp label="问题描述" req>
              <textarea value={f.description} onChange={e => set('description', e.target.value)} rows={5} placeholder="详细描述问题现象、复现步骤、影响用户量..." style={{ ...inp, resize: 'none' }} />
            </Inp>

            {/* 附件上传 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#1a2035', marginBottom: 8, display: 'block' }}>附件（图片 / 视频）</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: images.length || videos.length ? 10 : 0 }}>
                <button type="button" onClick={() => imgRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1.5px dashed #cbd5e1', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>
                  <span>🖼</span> 上传图片{images.length > 0 && ` (${images.length}/5)`}
                </button>
                <button type="button" onClick={() => vidRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1.5px dashed #cbd5e1', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>
                  <span>🎬</span> 上传视频{videos.length > 0 && ' (1/1)'}
                </button>
                <input ref={imgRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleImages(e.target.files)} />
                <input ref={vidRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideo(e.target.files)} />
              </div>
              {/* Image previews */}
              {images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img.url} alt={img.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }} />
                      <button onClick={() => setImages(p => p.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 99, background: '#FF6B6B', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button onClick={() => imgRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 10, border: '2px dashed #e2e8f0', background: '#f8fafc', cursor: 'pointer', color: '#94a3b8', fontSize: 22 }}>+</button>
                  )}
                </div>
              )}
              {/* Video preview */}
              {videos.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 10, padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 18 }}>🎬</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035' }}>{videos[0].name}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{videos[0].size}</div>
                  </div>
                  <button onClick={() => setVideos([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF6B6B', fontSize: 16 }}>×</button>
                </div>
              )}
              <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>最多 5 张图片 · 1 个视频（mp4/mov）</p>
            </div>
            <Inp label="标签（逗号分隔）">
              <input value={f.tags} onChange={e => set('tags', e.target.value)} placeholder="例：固件, iOS, 批量" style={inp} />
            </Inp>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Inp label="设备 SN（选填）">
                <input value={f.deviceSN} onChange={e => set('deviceSN', e.target.value)} placeholder="如：HK2K-US-2024-XXXXX" style={inp} />
              </Inp>
              <Inp label="APP 账号（选填）">
                <input value={f.appAccount} onChange={e => set('appAccount', e.target.value)} placeholder="用户邮箱或手机号" style={inp} />
              </Inp>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Reporter deadline + priority */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '2px solid #4FA7A030' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📅</span> 提出者设定（必填）
            </div>
            <Inp label="预期完成时间" req>
              <input type="date" value={f.expectedDate} onChange={e => set('expectedDate', e.target.value)} style={inp} />
              <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>负责人需在此日期前完成，超期需申请延期</p>
            </Inp>
            <Inp label="优先级" req>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['高', '中', '低'] as const).map(p => {
                  const c = PRIORITY_COLORS[p];
                  return <button key={p} onClick={() => set('priority', p)} style={{ flex: 1, padding: '9px 0', borderRadius: 12, border: f.priority === p ? `2px solid ${c}50` : '2px solid transparent', background: f.priority === p ? `${c}20` : '#F8FAFC', color: f.priority === p ? c : '#A0AEC0', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{p}</button>;
                })}
              </div>
              {f.priority === '高' && <div style={{ marginTop: 8, background: '#FF6B6B10', borderRadius: 10, padding: '6px 10px', fontSize: 11, color: '#FF6B6B', display: 'flex', alignItems: 'center', gap: 5 }}><AlertCircle size={12} />高优先级将自动发企微通知</div>}
            </Inp>
          </div>

          {/* Source + Country */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 12 }}>来源 &amp; 地区</div>
            <Inp label="问题来源" req>
              {(['APP工单', '邮件', '运营反馈'] as const).map(s => (
                <button key={s} onClick={() => set('source', s)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 6, padding: '8px 12px', borderRadius: 10, border: f.source === s ? `1.5px solid ${SOURCE_COLORS[s]}50` : '1.5px solid transparent', background: f.source === s ? `${SOURCE_COLORS[s]}12` : '#F8FAFC', color: f.source === s ? SOURCE_COLORS[s] : '#64748b', fontWeight: f.source === s ? 700 : 400, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: SOURCE_COLORS[s], flexShrink: 0, display: 'inline-block' }} />{s}
                </button>
              ))}
            </Inp>
            <Inp label="国家/地区" req>
              <select value={f.country} onChange={e => set('country', e.target.value)} style={sel}><option value="">选择国家...</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select>
            </Inp>
          </div>

          {/* Assign */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10 }}>指派负责人</div>
            {TEAM_MEMBERS.map(m => (
              <button key={m.name} onClick={() => set('owner', m.name)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginBottom: 6, padding: '8px 12px', borderRadius: 12, border: f.owner === m.name ? '1.5px solid #4FA7A050' : '1.5px solid transparent', background: f.owner === m.name ? '#4FA7A010' : '#F8FAFC', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 28, height: 28, borderRadius: 99, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: f.owner === m.name ? '#4FA7A0' : '#1a2035' }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{m.email}</div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => { if (!f.title || !f.expectedDate) { alert('请填写标题和预期完成时间'); return; } alert(`问题已提交！将通知负责人 ${f.owner} 并发送${f.priority === '高' ? '企微+' : ''}邮件提醒`); nav('/issues'); }} style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(79,167,160,0.35)' }}>
            <Send size={15} />提交问题
          </button>
          <button onClick={() => nav(-1)} style={{ background: '#F0F4F8', color: '#64748b', border: 'none', borderRadius: 14, padding: '11px 0', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>取消</button>
        </div>
      </div>
    </div>
  );
}
