'''
train-args.json
{
   "FP_DATA": "/opt/ml/input/data/cfg/visualsearch.yaml",
   "FP_YOLO": "/opt/ml/input/data/cfg/yolov5s.yaml",
   "FP_HYP": "/opt/ml/input/data/cfg/hyp.finetune.yaml",    
   "FP_WEIGHT": "/opt/ml/input/data/weights/yolov5s.pt",
   "NAME": "visualsearch",
   "IMG_SIZE": "640",
   "EPOCHS": "50",
   "BATCH": "16"
}
'''
from argparse import ArgumentParser, Namespace
from pathlib import Path
from numpy import imag
import yaml
import os
from sklearn.model_selection import train_test_split


#Utility function to move images 
def move_files_to_folder(list_of_files, destination_folder):
    for f in list_of_files:
        try:
            os.system(f'mv \"{f}\" \"{destination_folder}\"')
            #print(f'mv {f} {destination_folder}')
            #shutil.move(f, destination_folder)
        except:
            print(f)
            assert False


def main(args):
    print(args.data_yaml)
    ori_yaml = {}
    with open(args.data_yaml, 'r') as yaml_file:
        data = yaml.safe_load(yaml_file)
        ori_yaml = data

        #print(data['train'])
        #print(data['val'])

        # Read images and annotations
        images_dir = data['train']
        images = [os.path.join(images_dir, x) for x in os.listdir(images_dir)]
        labels_dir = os.path.join(os.path.dirname(images_dir), 'labels')
        labels = [os.path.join(labels_dir, x) for x in os.listdir(labels_dir) if x[-3:] == "txt"]

        images.sort()
        labels.sort()
        #print(images, labels)

        # Split the dataset into train-valid-test splits 
        train_images, val_images, train_labels, val_labels = train_test_split(images, labels, test_size=args.val_size, random_state=args.random_seed)

        os.system(f'mkdir {images_dir}/train {images_dir}/val {labels_dir}/train {labels_dir}/val')

        # Move the splits into their folders
        move_files_to_folder(train_images, f'{images_dir}/train')
        move_files_to_folder(val_images, f'{images_dir}/val')
        move_files_to_folder(train_labels, f'{labels_dir}/train')
        move_files_to_folder(val_labels, f'{labels_dir}/val')

    with open(args.data_yaml, 'w') as yaml_file:
        ori_yaml['train'] = f'{images_dir}/train'
        ori_yaml['val'] = f'{images_dir}/val'
        yaml.dump(ori_yaml, yaml_file)


def parse_args() -> Namespace:
    parser = ArgumentParser()
    parser.add_argument(
        "--data_yaml",
        type=Path
    )
    parser.add_argument(
        "--val_size",
        type=float,
        default=0.2
    )
    parser.add_argument(
        "--random_seed",
        type=int,
        default=0
    )

    args = parser.parse_args()
    return args

if __name__ == '__main__':
    args = parse_args()
    main(args)
