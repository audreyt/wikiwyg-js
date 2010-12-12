#!/usr/bin/env perl
use strict;
use warnings;
use FindBin '$RealBin';
use lib "$RealBin/lib";
use base qw(HTTP::Server::Simple::CGI);
use HTTP::Server::Simple::Static;

sub handle_request {
    my ( $self, $cgi ) = @_;

    if ($cgi->url( -absolute => 1, -path_info => 1 ) eq '/') {
        print "HTTP/1.1 302 Found\015\012";
        print "Location: /demo/index.html\015\012";
    }

    return $self->serve_static( $cgi, "$RealBin" );
}

my $server = __PACKAGE__->new();
$server->run();

1;
