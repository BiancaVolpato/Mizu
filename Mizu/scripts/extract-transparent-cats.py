"""Extract the 25 supplied cutouts without rescaling or redrawing their pixels.
Development helper only: requires Pillow, numpy and scipy.
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

root = Path(__file__).resolve().parents[1]
rgba = np.asarray(Image.open(root / 'assets/cats/approved-sheet.png').convert('RGBA'))
labels, _ = ndi.label(rgba[:,:,3] > 30)
sizes = np.bincount(labels.ravel())
objects = ndi.find_objects(labels)
cats = [(index, box) for index,box in enumerate(objects,1) if sizes[index] > 10000]
assert len(cats) == 25, f'Expected 25 cats, found {len(cats)}'
cats.sort(key=lambda item: item[1][0].start)
coats = ['white','black','gray','orange','siamese']
moods = ['sleeping','stretching','playing','happy','celebrating']
large_labels = np.where(np.isin(labels,[index for index,_ in cats]),labels,0)
distance, nearest = ndi.distance_transform_edt(large_labels == 0,return_indices=True)
owner = large_labels[nearest[0],nearest[1]]
outdir = root / 'assets/cats/approved'
outdir.mkdir(exist_ok=True)
for row,coat in enumerate(coats):
    group = sorted(cats[row*5:row*5+5],key=lambda item:item[1][1].start)
    for mood,(index,box) in zip(moods,group):
        y0,y1 = max(0,box[0].start-8),min(rgba.shape[0],box[0].stop+8)
        x0,x1 = max(0,box[1].start-8),min(rgba.shape[1],box[1].stop+8)
        crop = rgba[y0:y1,x0:x1].copy()
        crop[:,:,3][(owner[y0:y1,x0:x1] != index) | (distance[y0:y1,x0:x1] > 8)] = 0
        canvas = Image.new('RGBA',(400,400))
        image = Image.fromarray(crop)
        assert image.width <= 400 and image.height <= 400
        canvas.alpha_composite(image,((400-image.width)//2,400-image.height))
        canvas.save(outdir/f'{coat}-{mood}.png')
print('25 original transparent cutouts extracted on uniform canvases.')
