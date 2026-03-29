require 'fileutils'
require 'thread'

Jekyll::Hooks.register :site, :post_write do |site|
  if ENV['SKIP_WEBP'] == 'true'
    puts "Skipping WebP conversion (SKIP_WEBP=true)"
    next
  end
  
  puts "Converting images to WebP..."
  
  site_images_dir = File.join(site.dest, 'assets', 'images')
  
  if Dir.exist?(site_images_dir)
    images = Dir.glob(File.join(site_images_dir, '**', '*.{jpg,jpeg,png,JPG,JPEG,PNG}'))
    
    # Process images in parallel using threads
    threads = []
    mutex = Mutex.new
    thread_count = [4, images.size].min # Use up to 4 threads
    
    images.each_slice((images.size.to_f / thread_count).ceil) do |image_batch|
      threads << Thread.new do
        image_batch.each do |image_path|
          webp_path = image_path.sub(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '.webp')
          
          # Skip if webp is newer than source
          next if File.exist?(webp_path) && File.mtime(webp_path) >= File.mtime(image_path)
          
          # Convert to WebP with error handling
          begin
            # First try to fix corrupted PNGs by re-saving them
            if image_path =~ /\.png$/i
              temp_path = "#{image_path}.tmp"
              system("magick", image_path, temp_path, err: File::NULL, out: File::NULL)
              if File.exist?(temp_path) && File.size(temp_path) > 0
                FileUtils.mv(temp_path, image_path, force: true)
              end
            end
            
            # Convert to WebP
            success = system("magick", image_path, "-quality", "80", "-define", "webp:method=6", webp_path, err: File::NULL, out: File::NULL)
            
            if success && File.exist?(webp_path)
              original_size = File.size(image_path) / 1024.0
              webp_size = File.size(webp_path) / 1024.0
              savings = ((original_size - webp_size) / original_size * 100).round(1)
              
              mutex.synchronize do
                puts "  ✓ #{File.basename(image_path)} (#{original_size.round(1)}KB → #{webp_size.round(1)}KB, #{savings}% smaller)"
              end
            end
          rescue => e
            mutex.synchronize do
              puts "  ✗ Skipped: #{File.basename(image_path)}"
            end
          end
        end
      end
    end
    
    threads.each(&:join)
  end
  
  puts "WebP conversion complete!"
end
