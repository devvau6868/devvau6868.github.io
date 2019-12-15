---
layout: post
title: Github
date: 2018-10-02 20:00:00 +0700
description: You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. # Add post description (optional)
img: software.jpg # Add image post (optional)
tags: [Productivity, Software] # add tag
---
 
## Mục đích
 
 
Tôi dự định quản lý tất cả các tệp cấu hình máy chủ với git để tôi có thể ghi lại các thay đổi cấu hình. Nhưng một câu hỏi là, làm thế nào để mọi người cộng tác? Thông tin cấu hình máy chủ rất nhạy cảm Nếu kho lưu trữ này bị rò rỉ, toàn bộ kiến ​​trúc máy chủ của công ty bị rò rỉ hoàn toàn. Kho lưu trữ này chỉ có thể được giải mã trên máy tính cục bộ của nhà phát triển Máy chủ lưu trữ kho lưu trữ từ xa không nên biết nội dung của tệp.

Giải pháp là kho lưu trữ git cục bộ được giải mã. Nội dung được mã hóa trong quá trình tải lên, khóa được lưu cục bộ và khóa có thể được chia sẻ với các nhà phát triển khác.

### Xem xét một số giải pháp:

1. ``git-crypt``：Nguyên tắc là để thêm fiter mã hóa và khác biệt, nhưng chính thức nói rằng nó chỉ thích hợp để mã hóa một số tập tin, không phải cho mã hóa thư viện phiên bản đầy đủ. Một phần của mã hóa tập tin là rất dễ dàng để gây ra rò rỉ thông tin, nó phải được phiên bản đầy đủ của mã hóa thư viện là phù hợp.

2. Loạt '' sshfs`` máy chủ từ xa và hệ thống file mã hóa '' encfs``: Thứ nhất, tải hệ thống với các tập tin từ xa '' sshfs``, và sau đó tạo ra một hệ thống tập tin được mã hóa sử dụng ` 'encfs``. Tôi đoán mọi người không thể được giải quyết cùng lúc '' điều kiện cạnh tranh trong tình hình push`` và EncFS lỗ hổng bảo mật, cần phải tải hai tập tin trên hệ thống trước khi sử dụng '' push / pull``, nó không phải là rất thuận tiện.

3. `` git-remote-gcryp``t sử dụng `` gpg`` để mã hóa từ xa. Nó phù hợp với mô hình dự kiến ​​của tôi, nhưng việc sử dụng `` gpg`` không đặc biệt thuận tiện cho việc cộng tác. Nhưng các phương pháp khác không hoạt động, chỉ có phương pháp này.

#### Cách sử dụng


######  Cài đặt git-remote-gcrypt và gnupg
```
sudo apt-get install git-remote-gcrypt gnupg
```
###### Tạo khóa gpg
Cần đặt tên người dùng, hộp thư, mô tả, v.v., không đặt thời gian hết hạn
```
gpg --gen-key
```
###### Ghi lại ID của khóa được tạo

Ví dụ, liberxue013 vào năm 2048R / liberxue013, 2048 đại diện cho số vòng mã hóa, nó càng không dễ dàng để crack
```
gpg --list-keys
```
###### Tạo một kho lưu trữ thử nghiệm
```
mkdir test1 && cd test1
git init .
echo "test" > a.txt
git add . && git ci -m "update"
```
##### Tạo dự án thử nghiệm

Tạo một dự án trên github của bạn, ví dụ: https://github.com/liberxue
######  Cấu hình kho lưu trữ được mã hóa từ xa
```
git remote add cryptremote gcrypt::git@github.com:liberxue/liberxue.git
```
###### Tốt nhất là chỉ định khóa nào cần mã hóa.
 Bằng cách này, bạn có thể chia sẻ khóa này để người khác sử dụng.
```
git config remote.cryptremote.gcrypt-participants "liberxue013"
```
###### push từ xa
```
git push cryptremote master
```
* Truy cập kho lưu trữ từ xa, xem nội dung của tệp và thông tin trong cam kết, chúng có được mã hóa không?

## Cách chia sẻ với người khác


##### Key để chia sẻ
```
gpg --export-secret-key -a "share@share.com" > secretkey.asc
```
- Chia sẻ secretkey.asc cho người khác Khi sao chép, hãy nhớ nén và mã hóa trước khi gửi.

###### Được nhập từ máy tính của người khác
```
gpg --import secretkey.asc
```
###### Tải code xuống
```
git clone gcrypt::git@github.com:liberxue/liberxue.git test2 // Test2 là git clone văn bản cục bộ
件名
```
###### Đồng thời chỉ định khóa nào cần mã hóa

```
git config remote.cryptremote.gcrypt-participants "liberxue013"

```


Bằng cách này, bạn có thể sử dụng `` git`` để quản lý một số thông tin cá nhân và cộng tác (chẳng hạn như cấu hình máy chủ), hoặc bạn có thể sử dụng github như một hệ thống điều khiển phiên bản riêng (thông điệp cam kết hoặc bản rõ)
