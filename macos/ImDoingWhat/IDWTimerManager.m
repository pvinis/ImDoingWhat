//
//  IDWTimerManager.m
//  ImDoingWhat
//
//  Created by Pavlos Vinieratos on 09/02/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "IDWTimerManager.h"

@implementation IDWTimerManager {
  NSTimer *_timer;
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"tick"];
}

RCT_EXPORT_METHOD(start:(NSTimeInterval)millis)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [_timer invalidate];
    _timer = nil;
    _timer = [NSTimer scheduledTimerWithTimeInterval:millis
                                             repeats:YES
                                               block:^(NSTimer *timer) {
                                                 [self sendEventWithName:@"tick"
                                                                    body:nil];
                                               }];
  });
}

RCT_EXPORT_METHOD(stop)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [_timer invalidate];
    _timer = nil;
  });
}

@end
